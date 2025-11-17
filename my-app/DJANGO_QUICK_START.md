# Django Backend - Quick Reference Guide

This guide provides a quick reference for setting up the Django backend to work with the React frontend.

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install packages
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
```

## Django Settings Configuration

Add to `settings.py`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',  # Your app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
CORS_ALLOW_CREDENTIALS = True

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# JWT Configuration
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

## Database Models

Create `api/models.py`:

```python
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=50)
    limit_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'category')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.category} - ${self.limit_amount}"


class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Transport', 'Transport'),
        ('Entertainment', 'Entertainment'),
        ('Education', 'Education'),
        ('Supplies', 'Supplies'),
        ('Other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.category}) - ${self.amount}"


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=Transaction.CATEGORY_CHOICES)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - ${self.amount}"
```

## Serializers

Create `api/serializers.py`:

```python
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, Budget, Expense

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'name', 'category', 'amount', 'date', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Budget
        fields = ['id', 'category', 'limit_amount', 'spent', 'percentage', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_spent(self, obj):
        """Calculate total spent in this category"""
        from django.db.models import Sum
        from django.utils import timezone
        import datetime
        
        today = timezone.now().date()
        first_day = today.replace(day=1)
        
        total = Transaction.objects.filter(
            user=obj.user,
            category=obj.category,
            date__gte=first_day,
            date__lte=today
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        return float(total)
    
    def get_percentage(self, obj):
        """Calculate spending percentage"""
        spent = self.get_spent(obj)
        limit = float(obj.limit_amount)
        return int((spent / limit * 100)) if limit > 0 else 0


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'name', 'category', 'amount', 'date', 'notes', 'created_at']
        read_only_fields = ['id', 'date', 'created_at']


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user
```

## Views and ViewSets

Create `api/views.py`:

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import Transaction, Budget, Expense
from .serializers import (
    TransactionSerializer, BudgetSerializer, ExpenseSerializer,
    RegisterSerializer, UserSerializer
)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        
        # Filtering
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        return queryset


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get dashboard overview"""
        today = timezone.now().date()
        first_day = today.replace(day=1)
        
        # Calculate monthly spending
        monthly_spent = Transaction.objects.filter(
            user=request.user,
            date__gte=first_day,
            date__lte=today
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Get budget limit
        budgets = Budget.objects.filter(user=request.user)
        budget_limit = sum(b.limit_amount for b in budgets)
        
        # Get recent transactions
        recent = Transaction.objects.filter(user=request.user)[:5]
        
        return Response({
            'budgetSpent': float(monthly_spent),
            'budgetLimit': float(budget_limit),
            'budgetPercentage': int((float(monthly_spent) / float(budget_limit) * 100) if budget_limit > 0 else 0),
            'recentTransactions': TransactionSerializer(recent, many=True).data,
        })
    
    @action(detail=False, methods=['get'])
    def spending_breakdown(self, request):
        """Get spending by category"""
        today = timezone.now().date()
        first_day = today.replace(day=1)
        
        data = Transaction.objects.filter(
            user=request.user,
            date__gte=first_day
        ).values('category').annotate(total=Sum('amount'))
        
        return Response(list(data))


class RegisterView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register new user"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT token
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## URL Configuration

Create `api/urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'budgets', views.BudgetViewSet, basename='budget')
router.register(r'expenses', views.ExpenseViewSet, basename='expense')
router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')
router.register(r'auth', views.RegisterView, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('auth/register/', views.RegisterView.as_view({'post': 'register'}), name='auth_register'),
]
```

Update main `urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

## Setup Instructions

1. **Create migrations and migrate**:
```bash
python manage.py makemigrations
python manage.py migrate
```

2. **Create superuser**:
```bash
python manage.py createsuperuser
```

3. **Run server**:
```bash
python manage.py runserver
```

4. **Test endpoints with frontend** (running on localhost:5173)

## Common Patterns

### Filter Transactions by Date Range
```
GET /api/transactions/?date_from=2024-01-01&date_to=2024-12-31
```

### Search Transactions
```
GET /api/transactions/?search=coffee
```

### Get Specific Category Spending
```
GET /api/transactions/?category=Food
```

### Get Monthly Overview
The frontend will call `/api/dashboard/overview/` which returns:
- Current month spending
- Budget limit
- Spending percentage
- Recent transactions

## Deployment Considerations

- Set `DEBUG = False` in production
- Use environment variables for sensitive settings
- Configure proper CORS for production domain
- Use HTTPS in production
- Set up proper database (PostgreSQL recommended)
- Use WhiteNoise for static files
- Configure logging

## Testing

```bash
# Run tests
python manage.py test

# Test with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```
