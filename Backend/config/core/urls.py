from django.urls import path
from .views import SignupView, ProfileView,UsersListView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('profile/', ProfileView.as_view()),
    path("users/", UsersListView.as_view()),
]