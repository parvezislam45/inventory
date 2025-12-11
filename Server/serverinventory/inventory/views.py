
from rest_framework import generics,status
from .models import Category,Product,Shop,Invoice,Brand,OrderItem
from .serializers import CategorySerializer,ProductSerializer,ShopSerializer,BrandSerializer,InvoiceSerializer,CreateInvoiceSerializer,UpdateOrderItemSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView


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