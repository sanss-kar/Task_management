from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL

class Project(models.Model):
    name = models.CharField(max_length=255)
    description  =models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name


 
    
class ProjectMember(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')

    class Meta:
        unique_together = ('user', 'project')

    def __str__(self):
        return f"{self.user} - {self.project}"