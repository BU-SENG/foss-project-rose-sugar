from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import AuthViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    # Router-managed viewset endpoints (e.g. /api/auth/register/)
    path('', include(router.urls)),

    # SimpleJWT endpoints under the auth namespace so frontend can call
    # /api/auth/token/ and /api/auth/token/refresh/
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
