from django.db import models
from django.conf import settings
from projects.models import Project

# Create your models here.

User = settings.AUTH_USER_MODEL

class Task(models.Model):
    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )


    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')

    due_date = models.DateField(null=True, blank=True)

    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')

    created_at = models.DateTimeField(auto_now_add=True)




    def __str__(self):
        return self.title
