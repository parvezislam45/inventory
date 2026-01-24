from rest_framework import serializers
from .models import Category,Product,Shop,OrderItem,Invoice,Brand,ProductStockHistory
from django.utils.text import slugify
from django.db import transaction
from decimal import Decimal
from django.db import transaction
from django.db.models import F


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name', 'cat_image', 'slug']
        read_only_fields = ['slug']

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['category_name'])
        return super().create(validated_data)
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'brand_name', 'slug']
        read_only_fields = ['slug']

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['brand_name'])
        return super().create(validated_data)
       
class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        required=False  # make optional
    )
    brand = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        write_only=True,
        required=False  # make optional
    )
    category_name = serializers.StringRelatedField(source='category', read_only=True)
    brand_name = serializers.StringRelatedField(source='brand', read_only=True)
    image = serializers.ImageField(required=False)  # make optional

    class Meta:
        model = Product
        fields = [
            'id',
            'product_name',
            'description',
            'mrp_price',
            'tp_price',
            'stock',
            'category',      
            'category_name',  
            'brand',          
            'brand_name',     
            'image'
        ]
        
class ProductRestockSerializer(serializers.Serializer):
    added_stock = serializers.IntegerField(min_value=1)

    def validate_added_stock(self, value):
        if value <= 0:
            raise serializers.ValidationError("Added stock must be greater than 0")
        return value
    
class ProductStockHistorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)

    class Meta:
        model = ProductStockHistory
        fields = [
            'id',
            'product_name',
            'last_stock',
            'added_stock',
            'current_stock',
            'tp_price',
            'total_stock_price',
            'created_at'
        ]

class DailyStockSummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    grand_total_price = serializers.IntegerField()
    
class DailyStockItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)

    class Meta:
        model = ProductStockHistory
        fields = [
            'id',
            'product_name',
            'last_stock',
            'added_stock',
            'current_stock',
            'tp_price',
            'total_stock_price',
            'created_at'
        ]

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id', 'shop_name', 'address', 'phone', 'discount_kazi', 'discount_harvest']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True) 
    brand = serializers.CharField(source="product.brand", read_only=True)
    tp_price = serializers.DecimalField(source="product.tp_price", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'quantity', 'total_price', 'discount_amount',
            'final_price','brand','tp_price','created_at'
        ]

class CreateOrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()

    def validate(self, data):
        product_id = data.get("product_id")
        quantity = data.get("quantity")

        if quantity <= 0:
            raise serializers.ValidationError({"quantity": "Quantity must be > 0"})
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product does not exist"})

        if product.stock <= 0:
            raise serializers.ValidationError({"stock": "Product out of stock"})
        if product.stock < quantity:
            quantity = product.stock

        data["product"] = product
        data["quantity"] = quantity
        return data

    def create(self, validated_data):
        product = validated_data["product"]
        quantity = validated_data["quantity"]
        product.stock = max(product.stock - quantity, 0)
        product.save()

        order_item = OrderItem.objects.create(
            product=product,
            quantity=quantity,
            total_price=product.tp_price * quantity,
            discount_amount=0,
            final_price=product.tp_price * quantity
        )
        return order_item

# ----------------------------
# Invoice Serializer
# ----------------------------
class InvoiceSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'is_delivered', 'shop', 'discount_type',
            'subtotal', 'discount_percent', 'discount_amount', 'final_total',
            'items', 'created_at'
        ]

    def create(self, validated_data):
        request = self.context['request']
        items_data = request.data.get('items', [])

        invoice = Invoice.objects.create(**validated_data)
        subtotal = Decimal(0)

        for item_data in items_data:
            product = Product.objects.get(id=item_data['product'])
            quantity = int(item_data['quantity'])

            # Limit quantity to available stock
            quantity = min(quantity, product.stock)

            total_price = product.tp_price * quantity

            discount_amount = 0
            if invoice.discount_type == 'percent' and invoice.discount_percent:
                discount_amount = (total_price * invoice.discount_percent) / 100
            elif invoice.discount_type == 'amount' and invoice.discount_amount:
                discount_amount = invoice.discount_amount

            final_price = total_price - discount_amount
            subtotal += final_price

            # Create order item
            OrderItem.objects.create(
                invoice=invoice,
                product=product,
                quantity=quantity,
                total_price=total_price,
                discount_amount=discount_amount,
                final_price=final_price,
            )

            # Deduct stock safely
            product.stock = max(product.stock - quantity, 0)
            product.save()

        invoice.subtotal = subtotal
        invoice.final_total = subtotal
        invoice.save()

        return invoice

# ----------------------------
# Create Invoice Serializer
# ----------------------------
class CreateInvoiceSerializer(serializers.Serializer):
    shop_id = serializers.IntegerField()
    discount_type = serializers.CharField(required=False)
    items = CreateOrderItemSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        shop = Shop.objects.get(id=validated_data['shop_id'])
        discount_type = validated_data.get('discount_type', '')
        items = validated_data['items']

        # Get or create invoice not delivered
        invoice = Invoice.objects.filter(shop=shop, is_delivered=False).last()
        if not invoice:
            invoice = Invoice.objects.create(shop=shop, discount_type=discount_type)
        else:
            invoice.discount_type = discount_type
            invoice.save()

        # Determine discount percent based on shop
        discount_percent = {
            "discount_kazi": Decimal(shop.discount_kazi or 0),
            "discount_harvest": Decimal(shop.discount_harvest or 0)
        }.get(discount_type, Decimal(0))

        for item in items:
            product = Product.objects.get(id=item['product_id'])
            qty = min(item['quantity'], product.stock)  # prevent over-order
            if qty <= 0:
                continue  # skip if no stock

            total_price = product.tp_price * qty
            discount_amount = (total_price * discount_percent) / 100
            final_price = total_price - discount_amount

            # Check if item exists in invoice
            existing_item = OrderItem.objects.filter(invoice=invoice, product=product).first()
            if existing_item:
                existing_item.quantity += qty
                existing_item.total_price += total_price
                existing_item.discount_amount += discount_amount
                existing_item.final_price += final_price
                existing_item.save()
            else:
                OrderItem.objects.create(
                    invoice=invoice,
                    product=product,
                    quantity=qty,
                    total_price=total_price,
                    discount_amount=discount_amount,
                    final_price=final_price
                )

            # Reduce product stock only once
            product.stock -= qty
            product.save()

        # Recalculate invoice totals
        all_items = OrderItem.objects.filter(invoice=invoice)
        invoice.subtotal = sum(i.total_price for i in all_items)
        invoice.discount_amount = sum(i.discount_amount for i in all_items)
        invoice.final_total = sum(i.final_price for i in all_items)
        invoice.discount_percent = discount_percent
        invoice.save()

        return invoice

    def to_representation(self, instance):
        return InvoiceSerializer(instance).data


# ----------------------------
# Update Order Item Serializer
# ----------------------------
class UpdateOrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(required=False)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'quantity', 'product_id', 'final_price', 'total_price', 'discount_amount']

    def update(self, instance, validated_data):
        invoice = instance.invoice
        if invoice.is_delivered:
            raise serializers.ValidationError("Cannot modify delivered invoices.")

        product = instance.product
        old_qty = instance.quantity
        new_qty = validated_data.get('quantity', old_qty)

        # Handle product change
        product_id = validated_data.get('product_id')
        if product_id and product_id != product.id:
            new_product = Product.objects.get(id=product_id)
            product.stock += old_qty  # restore old stock
            product.save()
            product = new_product
            instance.product = new_product
            old_qty = 0  # treat as new order

        qty_diff = new_qty - old_qty

        # Adjust stock based on qty_diff
        if qty_diff > 0:
            if product.stock < qty_diff:
                raise serializers.ValidationError("Not enough stock available.")
            product.stock -= qty_diff
        elif qty_diff < 0:
            product.stock += abs(qty_diff)

        product.save()

        # Update order item totals
        instance.quantity = new_qty
        instance.total_price = product.tp_price * new_qty

        discount_percent = {
            'discount_kazi': invoice.shop.discount_kazi or 0,
            'discount_harvest': invoice.shop.discount_harvest or 0
        }.get(invoice.discount_type, 0)

        instance.discount_amount = (instance.total_price * discount_percent) / 100
        instance.final_price = instance.total_price - instance.discount_amount
        instance.save()

        # Update invoice totals
        all_items = OrderItem.objects.filter(invoice=invoice)
        invoice.subtotal = sum(i.total_price for i in all_items)
        invoice.discount_amount = sum(i.discount_amount for i in all_items)
        invoice.final_total = sum(i.final_price for i in all_items)
        invoice.save()

        return instance




