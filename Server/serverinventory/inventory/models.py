from django.db import models
from django.utils import timezone
from django.db.models import Sum
class Category(models.Model):
    category_name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    cat_image = models.ImageField(upload_to='photos/categories', blank=True)

    def __str__(self):
        return self.category_name
    
class Brand(models.Model):
    brand_name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    def __str__(self):
        return self.brand_name
    
class Product(models.Model):
    product_name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    description = models.CharField(max_length=2000)
    tp_price = models.IntegerField()
    mrp_price = models.IntegerField()
    stock = models.IntegerField()
    is_available = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='photos/products', blank=True)
    
class Shop(models.Model):
    shop_name = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=2000)
    phone = models.IntegerField(blank=True, null=True)
    discount_kazi = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount_harvest = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.shop_name
    
class Order(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    shop = models.ForeignKey('Shop', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)  
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    invoice_number = models.CharField(max_length=20, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            today = timezone.now().strftime("%Y%m%d")
            last_order = Order.objects.filter(invoice_number__startswith=f"INV-{today}").order_by('id').last()
            next_number = 1 if not last_order else int(last_order.invoice_number[-3:]) + 1
            self.invoice_number = f"INV-{today}-{next_number:03}"
        super().save(*args, **kwargs)
        
class Invoice(models.Model):
    shop = models.ForeignKey('Shop', on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=20, unique=True, blank=True)
    is_delivered = models.BooleanField(default=False)
    discount_type = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def calculate_totals(self):
        subtotal_result = self.items.aggregate(total=Sum('total_price'))
        subtotal = subtotal_result['total'] or 0
        discount_result = self.items.aggregate(total=Sum('discount_amount'))
        discount_amount = discount_result['total'] or 0
        final_total_result = self.items.aggregate(total=Sum('final_price'))
        final_total = final_total_result['total'] or 0
        self.subtotal = subtotal
        self.discount_amount = discount_amount
        self.final_total = final_total
        if subtotal > 0:
            self.discount_percent = (discount_amount / subtotal) * 100
        else:
            self.discount_percent = 0
            
        self.save(update_fields=['subtotal', 'discount_amount', 'final_total', 'discount_percent'])

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            today = timezone.now().strftime("%Y%m%d")
            last_invoice = Invoice.objects.filter(
                invoice_number__startswith=f"INV-{today}"
            ).order_by('id').last()
            next_number = 1 if not last_invoice else int(last_invoice.invoice_number[-3:]) + 1
            self.invoice_number = f"INV-{today}-{next_number:03}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.shop.shop_name}"




class OrderItem(models.Model):
    invoice = models.ForeignKey('Invoice', on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_delivered = models.BooleanField(default=False)

    def recalculate(self):
        self.total_price = self.product.tp_price * self.quantity
        self.final_price = self.total_price - self.discount_amount

    def save(self, *args, **kwargs):
        self.recalculate()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.product_name} x {self.quantity} ({self.invoice.invoice_number})"

