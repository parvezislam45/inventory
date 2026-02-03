
from rest_framework import generics,status
from .models import Category,Product,Shop,Invoice,Brand,OrderItem,ProductStockHistory
from .serializers import CategorySerializer,ProductSerializer,ShopSerializer,BrandSerializer,InvoiceSerializer,CreateInvoiceSerializer,UpdateOrderItemSerializer,ProductRestockSerializer,ProductStockHistorySerializer,DailyStockItemSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView,ListAPIView
from rest_framework.views import APIView
from django.db.models import Sum, F
from django.db.models.functions import TruncDate
from datetime import datetime


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'
class BrandListCreateView(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    
class BrandRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    
class ProductRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
class ProductRestockView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, id):
        product = Product.objects.get(id=id)
        serializer = ProductRestockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        added_stock = serializer.validated_data['added_stock']
        last_stock = product.stock
        current_stock = last_stock + added_stock

        # update product stock
        product.stock = current_stock
        product.save()

        # save stock history
        ProductStockHistory.objects.create(
            product=product,
            brand=product.brand, # <-- add this line
            last_stock=last_stock,
            added_stock=added_stock,
            current_stock=current_stock,
            tp_price=product.tp_price,
            total_stock_price=added_stock * product.tp_price
            )

        return Response({
            "message": "Stock updated successfully",
            "product_name": product.product_name,
            "brand_name": product.brand.brand_name if product.brand else None,
            "last_stock": last_stock,
            "added_stock": added_stock,
            "current_stock": current_stock,
            "tp_price": product.tp_price,
            "total_stock_price": added_stock * product.tp_price
        }, status=status.HTTP_200_OK)
        
class ProductStockHistoryListView(generics.ListAPIView):
    queryset = ProductStockHistory.objects.select_related('product').all()
    serializer_class = ProductStockHistorySerializer
    permission_classes = [AllowAny]

class DailyStockSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        daily_data = (
            ProductStockHistory.objects
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(grand_total_price=Sum('total_stock_price'))
            .order_by('-date')
        )

        return Response(daily_data)
    

class DailyStockDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, date):
        """
        date format: YYYY-MM-DD
        """
        try:
            parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)

        queryset = ProductStockHistory.objects.filter(
            created_at__date=parsed_date
        ).select_related("product", "brand")

        serializer = ProductStockHistorySerializer(queryset, many=True)

        grand_total_price = sum(
            item.total_stock_price for item in queryset
        )

        return Response({
            "date": date,
            "items": serializer.data,          # ✅ DATE-WISE ITEMS
            "grand_total_price": grand_total_price
        }, status=200)
class ProductStockSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = Product.objects.aggregate(
            total_stock=Sum('stock'),
            total_tp_price=Sum(F('stock') * F('tp_price'))
        )

        return Response({
            "total_stock": data['total_stock'] or 0,
            "total_tp_price": data['total_tp_price'] or 0
        })

class BrandWiseStockSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = (
            Product.objects
            .filter(brand__isnull=False)
            .values(
                'brand__id',
                'brand__brand_name'
            )
            .annotate(
                total_stock=Sum('stock'),
                total_tp_price=Sum(F('stock') * F('tp_price'))
            )
            .order_by('brand__brand_name')
        )

        return Response(data)
    
class ProductDestroyView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class ShopListCreateView(generics.ListCreateAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    
class ShopRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    lookup_field = 'id'

class CreateInvoiceView(generics.CreateAPIView):
    serializer_class = CreateInvoiceSerializer

class InvoiceDetailView(APIView):
    def get(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
            serializer = InvoiceSerializer(invoice)
            return Response(serializer.data)
        except Invoice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)

            # ✅ Restore stock for all products before deleting
            for item in invoice.items.all():  # assuming related_name='items' in OrderItem
                product = item.product
                product.stock += item.quantity
                product.save()

            # ✅ Delete the invoice
            invoice.delete()

            # ✅ Get updated invoice list and recalculate totals
            remaining_invoices = Invoice.objects.all().order_by('-id')
            serializer = InvoiceSerializer(remaining_invoices, many=True)

            return Response(
                {
                    "message": "Invoice deleted successfully and stock restored.",
                    "invoices": serializer.data
                },
                status=status.HTTP_200_OK
            )

        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
class MarkInvoiceDeliveredView(APIView):
    def post(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

        invoice.is_delivered = True
        invoice.save()
        return Response({"message": "Invoice marked as delivered", "invoice": InvoiceSerializer(invoice).data})
    
class InvoiceListView(generics.ListAPIView):
    queryset = Invoice.objects.all().order_by('-created_at')
    serializer_class = InvoiceSerializer


class ShopInvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        shop_id = self.kwargs['shop_id']
        queryset = Invoice.objects.filter(shop_id=shop_id).order_by('-created_at')

        # ✅ Get query parameters from frontend
        brand_name = self.request.query_params.get('brand_name', '').strip()
        date = self.request.query_params.get('date', '').strip()

        # ✅ Filter by brand name (matches product’s brand inside OrderItem)
        if brand_name:
            queryset = queryset.filter(items__product__brand__icontains=brand_name)

        # ✅ Filter by date (matches Invoice.created_at date)
        if date:
            queryset = queryset.filter(created_at__date=date)

        # ✅ Avoid duplicate invoices (due to JOIN on items)
        return queryset.distinct()

class UpdateOrderItemView(UpdateAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = UpdateOrderItemSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return updated invoice
        invoice = instance.invoice
        invoice_serializer = InvoiceSerializer(invoice)
        return Response(invoice_serializer.data, status=status.HTTP_200_OK)
# ✅ Remove an item - FIXED VERSION
class RemoveOrderItemView(APIView):
    def delete(self, request, id):
        try:
            item = OrderItem.objects.get(id=id)
            invoice = item.invoice
            
            # Store the item's final_price before deletion for stock restoration
            final_price_to_remove = item.final_price
            
            # ✅ Restore product stock
            product = item.product
            product.stock += item.quantity
            product.save()
            
            # Delete the item
            item.delete()
            
            # ✅ Recalculate invoice totals
            self.recalculate_invoice_totals(invoice)
            
            return Response(InvoiceSerializer(invoice).data, status=status.HTTP_200_OK)
        except OrderItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def recalculate_invoice_totals(self, invoice):
        """Recalculate invoice subtotal, discount, and final total"""
        # Get all remaining items for this invoice
        remaining_items = OrderItem.objects.filter(invoice=invoice)
        
        # Recalculate subtotal from remaining items
        new_subtotal = sum(item.final_price for item in remaining_items)
        
        # Update invoice
        invoice.subtotal = new_subtotal
        
        # Reapply discount based on discount type
        if invoice.discount_type == 'percent' and invoice.discount_percent:
            invoice.discount_amount = (new_subtotal * invoice.discount_percent) / 100
        elif invoice.discount_type == 'amount' and invoice.discount_amount:
            # Keep the fixed discount amount, but ensure it doesn't exceed subtotal
            invoice.discount_amount = min(invoice.discount_amount, new_subtotal)
        else:
            invoice.discount_amount = 0
        
        invoice.final_total = new_subtotal - invoice.discount_amount
        invoice.save()
        
        
class DeliveredInvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        return Invoice.objects.filter(is_delivered=True).order_by('-created_at')
    
class DeliveredInvoiceDeleteView(generics.DestroyAPIView):
    serializer_class = InvoiceSerializer
    queryset = Invoice.objects.filter(is_delivered=True)

    def delete(self, request, *args, **kwargs):
        invoice = self.get_object()
        if not invoice.is_delivered:
            return Response(
                {"error": "Cannot delete an invoice that is not delivered."},
                status=status.HTTP_400_BAD_REQUEST
            )
        invoice.delete()
        return Response({"message": "Delivered invoice deleted successfully."}, status=status.HTTP_204_NO_CONTENT)