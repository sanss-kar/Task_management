from django.urls import path
from .views import ProjectView, ProjectDetailView, ProjectMembersView, ProjectMemberDeleteView, AddMemberView

urlpatterns = [
    path('', ProjectView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('<int:pk>/members/', ProjectMembersView.as_view()),
    path(
    "<int:project_id>/members/<int:user_id>/",
    ProjectMemberDeleteView.as_view()
),
path('<int:pk>/add-member/', AddMemberView.as_view()),
]