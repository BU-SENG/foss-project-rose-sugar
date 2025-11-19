from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Budget(models.Model):
    """Budget model for tracking spending limits by category"""
    CATEGORY_CHOICES = [
        ('food', 'Food & Groceries'),
        ('transport', 'Transport'),
        ('entertainment', 'Entertainment'),
        ('utilities', 'Utilities'),
        ('education', 'Education'),
        ('health', 'Health & Medical'),
        ('shopping', 'Shopping'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    limit_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='Monthly spending limit for this category'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'category')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} - {self.category}: ${self.limit_amount}"


class Transaction(models.Model):
    """Transaction model for tracking income and expenses"""
    TRANSACTION_TYPE_CHOICES = [
        ('expense', 'Expense'),
        ('income', 'Income'),
    ]

    EXPENSE_CATEGORIES = [
        ('food', 'Food & Groceries'),
        ('transport', 'Transport'),
        ('entertainment', 'Entertainment'),
        ('utilities', 'Utilities'),
        ('education', 'Education'),
        ('health', 'Health & Medical'),
        ('shopping', 'Shopping'),
        ('other', 'Other'),
    ]

    INCOME_CATEGORIES = [
        ('salary', 'Salary'),
        ('freelance', 'Freelance'),
        ('scholarship', 'Scholarship'),
        ('part-time job', 'Part-time Job'),
        ('internship', 'Internship'),
        ('bonus', 'Bonus'),
        ('investment', 'Investment'),
        ('gift', 'Gift'),
        ('allowance', 'Allowance'),
    ]

    ALL_CATEGORIES = EXPENSE_CATEGORIES + INCOME_CATEGORIES

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    category = models.CharField(
        max_length=50,
        choices=ALL_CATEGORIES,
        null=True,
        blank=True,
        help_text='Required for both income and expenses'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    description = models.CharField(max_length=255, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(fields=['user', 'type']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.type}: ${self.amount} on {self.date}"
