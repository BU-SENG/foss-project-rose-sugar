from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from datetime import datetime, timedelta
from decimal import Decimal
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    AuthResponseSerializer,
    TransactionSerializer,
    BudgetSerializer,
    DashboardOverviewSerializer,
    SpendingBreakdownSerializer,
)
from .models import Transaction, Budget


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login a user and return JWT tokens"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout a user (client should delete JWT tokens)"""
        return Response(
            {'message': 'Successfully logged out. Please delete your tokens.'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current authenticated user"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for CRUD operations on transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return transactions for the authenticated user only"""
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the user to the current authenticated user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get transactions filtered by category"""
        category = request.query_params.get('category')
        if not category:
            return Response(
                {'error': 'category parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transactions = self.get_queryset().filter(category=category)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_date_range(self, request):
        """Get transactions within a date range"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Date format should be YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transactions = self.get_queryset().filter(date__range=[start, end])
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expenses_this_month(self, request):
        """Get expenses for the current month"""
        today = datetime.now().date()
        first_day = today.replace(day=1)
        
        transactions = self.get_queryset().filter(
            type='expense',
            date__gte=first_day,
            date__lte=today
        )
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)


class BudgetViewSet(viewsets.ModelViewSet):
    """ViewSet for CRUD operations on budgets"""
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return budgets for the authenticated user only"""
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the user to the current authenticated user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def spending_vs_budget(self, request):
        """Compare spending against budgets for the current month"""
        today = datetime.now().date()
        first_day = today.replace(day=1)
        
        budgets = self.get_queryset()
        result = []
        
        for budget in budgets:
            # Get spending for this category this month
            spending = Transaction.objects.filter(
                user=request.user,
                type='expense',
                category=budget.category,
                date__gte=first_day,
                date__lte=today
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
            
            result.append({
                'category': budget.category,
                'budget_limit': str(budget.limit_amount),
                'spending': str(spending),
                'remaining': str(budget.limit_amount - spending),
                'percentage': float((spending / budget.limit_amount * 100)) if budget.limit_amount > 0 else 0,
                'over_budget': spending > budget.limit_amount,
            })
        
        return Response(result)


class DashboardViewSet(viewsets.ViewSet):
    """ViewSet for dashboard data and analytics"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get dashboard overview with key metrics"""
        user = request.user
        
        # Calculate totals
        total_expenses = Transaction.objects.filter(
            user=user,
            type='expense'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        total_income = Transaction.objects.filter(
            user=user,
            type='income'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        net_balance = total_income - total_expenses
        
        # This month's spending
        today = datetime.now().date()
        first_day = today.replace(day=1)
        this_month_spending = Transaction.objects.filter(
            user=user,
            type='expense',
            date__gte=first_day,
            date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        # Budget progress
        budgets = Budget.objects.filter(user=user)
        budget_progress = []
        for budget in budgets:
            spending = Transaction.objects.filter(
                user=user,
                type='expense',
                category=budget.category,
                date__gte=first_day,
                date__lte=today
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
            
            budget_progress.append({
                'category': budget.category,
                'limit': str(budget.limit_amount),
                'spent': str(spending),
                'percentage': float((spending / budget.limit_amount * 100)) if budget.limit_amount > 0 else 0,
            })
        
        data = {
            'total_expenses': str(total_expenses),
            'total_income': str(total_income),
            'net_balance': str(net_balance),
            'this_month_spending': str(this_month_spending),
            'budget_progress': budget_progress,
        }
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def spending_breakdown(self, request):
        """Get spending breakdown by category for current month"""
        today = datetime.now().date()
        first_day = today.replace(day=1)
        
        transactions = Transaction.objects.filter(
            user=request.user,
            type='expense',
            date__gte=first_day,
            date__lte=today
        ).values('category').annotate(total=Sum('amount'))
        
        # Calculate total for percentage
        total_spending = sum(t['total'] for t in transactions) or Decimal('1')
        
        result = []
        for item in transactions:
            result.append({
                'category': item['category'],
                'amount': str(item['total']),
                'percentage': float((item['total'] / total_spending * 100)),
            })
        
        return Response(result)

    @action(detail=False, methods=['get'])
    def spending_trend(self, request):
        """Get spending trend over last 30 days"""
        today = datetime.now().date()
        start_date = today - timedelta(days=29)
        
        # Group by date and sum
        transactions = Transaction.objects.filter(
            user=request.user,
            type='expense',
            date__gte=start_date,
            date__lte=today
        ).values('date').annotate(total=Sum('amount')).order_by('date')
        
        result = []
        for item in transactions:
            result.append({
                'date': item['date'],
                'amount': str(item['total']),
            })
        
        return Response(result)

    @action(detail=False, methods=['get'])
    def recent_transactions(self, request):
        """Get recent transactions"""
        limit = int(request.query_params.get('limit', 10))
        transactions = Transaction.objects.filter(
            user=request.user
        ).order_by('-date', '-created_at')[:limit]
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

