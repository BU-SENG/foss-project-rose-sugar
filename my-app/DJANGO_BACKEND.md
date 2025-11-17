# Django Backend Integration Guide

This frontend is configured to work seamlessly with a Django backend using Django REST Framework (DRF).

## Frontend Configuration

### 1. Enable Django Mode

Update your `.env.local` file:

```
VITE_DJANGO_BACKEND=true
VITE_API_URL=http://localhost:8000/api
```

### 2. CSRF Protection

The frontend automatically handles Django's CSRF token protection:
- For POST/PUT/DELETE requests, the `X-CSRFToken` header is automatically added
- CSRF token is read from the `csrftoken` cookie
- No additional configuration needed on the frontend

### 3. Authentication

The frontend supports both Django session auth and JWT tokens:

**Option A: JWT Token Auth (Recommended)**
```javascript
// After login, save the token
localStorage.setItem('auth_token', response.data.access);
localStorage.setItem('auth_refresh', response.data.refresh); // For token refresh
```

**Option B: Session Auth**
- Use `credentials: 'include'` in fetch requests (already configured)
- Set `HttpOnly` cookies on the backend

## Django Backend Setup

### Required Packages

```bash
pip install django djangorestframework django-cors-headers
```

### Django Settings Configuration

```python
# settings.py

INSTALLED_APPS = [
    # ... other apps
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# CORS Configuration - Allow frontend origin
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Vite dev server
    'http://localhost:3000',  # Alternative port
    'https://yourdomain.com',  # Production
]

# CORS Settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT Settings (if using JWT)
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### URL Configuration

```python
# urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('your_app.urls')),
]
```

## API Endpoints

The frontend expects the following Django REST Framework endpoints:

### Authentication

- `POST /api/auth/login/` - Get JWT tokens
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
  ```

- `POST /api/auth/register/` - User registration
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```

- `POST /api/auth/logout/` - Logout user

### Dashboard

- `GET /api/dashboard/overview/` - Get dashboard overview
  ```json
  {
    "budgetSpent": 1300,
    "budgetLimit": 2000,
    "budgetPercentage": 65,
    "totalSpent": 1300,
    "recentTransactions": []
  }
  ```

- `GET /api/dashboard/spending-breakdown/` - Get spending by category
- `GET /api/dashboard/spending-trend/` - Get spending over time
- `GET /api/dashboard/suggestions/` - Get AI suggestions
- `GET /api/dashboard/recent-transactions/` - Get recent transactions

### Transactions

- `GET /api/transactions/` - List transactions (supports filtering)
  - Query params: `category`, `date_from`, `date_to`, `search`
  - Paginated response (uses DRF pagination)

- `POST /api/transactions/` - Create transaction
  ```json
  {
    "name": "Campus Cafeteria",
    "category": "Food",
    "amount": -8.50,
    "date": "2024-11-17"
  }
  ```

- `PUT /api/transactions/{id}/` - Update transaction

- `DELETE /api/transactions/{id}/` - Delete transaction

### Budgets

- `GET /api/budgets/` - List budgets (paginated)
- `GET /api/budgets/{id}/` - Get specific budget
- `POST /api/budgets/` - Create budget
- `PUT /api/budgets/{id}/` - Update budget
- `DELETE /api/budgets/{id}/` - Delete budget

### Expenses

- `POST /api/expenses/` - Create expense
- `GET /api/expenses/categories/` - Get available categories

### Reports

- `GET /api/reports/overview/?period=30days` - Get report overview
- `GET /api/reports/spending-over-time/?period=30days` - Get spending trends
- `GET /api/reports/insights/` - Get AI insights
- `GET /api/reports/transactions/?limit=5` - Get recent transactions

## Response Format

All Django endpoints should follow DRF standard responses:

### Success (List)
```json
{
  "count": 100,
  "next": "http://api.example.com/transactions/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Campus Cafeteria",
      "category": "Food",
      "amount": -8.50,
      "date": "2024-11-17"
    }
  ]
}
```

### Success (Single Object)
```json
{
  "id": 1,
  "name": "Campus Cafeteria",
  "category": "Food",
  "amount": -8.50,
  "date": "2024-11-17"
}
```

### Error
```json
{
  "detail": "Not found."
}
```

## Example Django Model & Serializer

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Transport', 'Transport'),
        ('Entertainment', 'Entertainment'),
        ('Education', 'Education'),
        ('Supplies', 'Supplies'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']

# serializers.py
from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'name', 'category', 'amount', 'date']

# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# urls.py
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = router.urls
```

## Troubleshooting

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Verify `CORS_ALLOW_CREDENTIALS = True`

### CSRF Token Errors
- Check that `csrftoken` cookie is being set by Django
- Verify `CSRF_TRUSTED_ORIGINS` setting if needed
- Frontend automatically sends `X-CSRFToken` header

### 401 Unauthorized Errors
- Verify JWT token is valid and not expired
- Check `Authorization` header format: `Bearer <token>`
- For session auth, ensure cookies are being sent

### 403 Forbidden Errors
- Verify user has required permissions
- Check `DEFAULT_PERMISSION_CLASSES` in settings

## Next Steps

1. Set up Django models for transactions, budgets, expenses
2. Create Django REST Framework views and serializers
3. Implement authentication (JWT or session)
4. Test endpoints using Postman or similar tool
5. Update frontend `.env.local` with your backend URL
6. Run frontend dev server and test integration
