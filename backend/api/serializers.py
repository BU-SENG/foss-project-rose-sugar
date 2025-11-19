from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Transaction, Budget


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    password_confirm = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
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


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        data['user'] = user
        return data


class AuthResponseSerializer(serializers.Serializer):
    """Response format for login/register"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'type', 'category', 'amount', 'description', 'date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate(self, data):
        """Ensure category is provided for both income and expenses"""
        if not data.get('category'):
            raise serializers.ValidationError({"category": "Category is required for all transactions."})
        return data


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'limit_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class DashboardOverviewSerializer(serializers.Serializer):
    """Dashboard overview with spending summary"""
    total_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    net_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    this_month_spending = serializers.DecimalField(max_digits=10, decimal_places=2)
    budget_progress = serializers.ListField()  # List of category budgets with spending


class SpendingBreakdownSerializer(serializers.Serializer):
    """Spending breakdown by category"""
    category = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    percentage = serializers.FloatField()
    budget_limit = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)

