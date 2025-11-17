from django.contrib import admin
from .models import Transaction, Budget


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'category', 'amount', 'date', 'created_at')
    list_filter = ('type', 'category', 'date', 'user')
    search_fields = ('user__email', 'description', 'category')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-date', '-created_at')

    def get_queryset(self, request):
        """Only show transactions for the current user (non-superusers)"""
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(user=request.user)
        return qs


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'limit_amount', 'created_at')
    list_filter = ('category', 'user')
    search_fields = ('user__email', 'category')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    def get_queryset(self, request):
        """Only show budgets for the current user (non-superusers)"""
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(user=request.user)
        return qs
