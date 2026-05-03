from django.urls import path
from .views import TaskView, TaskDetailView, DashboardView

urlpatterns = [
    path('', TaskView.as_view()),
    path('<int:pk>/', TaskDetailView.as_view()),
     path('dashboard/', DashboardView.as_view()),
]