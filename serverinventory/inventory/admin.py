from django.contrib import admin
from .models import Category,Product,Shop,Order,OrderItem,Invoice,Brand
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('category_name',)}
    list_display = ('category_name', 'slug')

admin.site.register(Category, CategoryAdmin)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('brand_name',)}
    list_display = ('brand_name', 'slug')

admin.site.register(Brand, BrandAdmin)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'tp_price','mrp_price', 'stock', 'category', 'modified_date', 'is_available', 'image')
    prepopulated_fields = {'slug': ('product_name',)}

admin.site.register(Product, ProductAdmin)
admin.site.register(Shop)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Invoice)
