from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from django.db.models import Count, Q

from rest_framework.permissions import IsAuthenticated

from .models import Task
from .serializers import TaskSerializer


class TaskView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'admin':
            tasks = Task.objects.filter(project__created_by=request.user)
        else:
            tasks = Task.objects.filter(assigned_to=request.user)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'admin':
            return Response(
                {"error": "Only admin can create task"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Task created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        serializer = TaskSerializer(task, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task updated", "data": serializer.data})

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response(
                {"error": "Only admin can delete task"},
                status=403
            )

        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        task.delete()
        return Response({"message": "Task deleted"})



class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "admin":
            tasks = Task.objects.filter(project__created_by=user)

            member_activity = (
                tasks.values(
                    "assigned_to__username",
                    "project__name"
                )
                .annotate(
                    total_tasks=Count("id"),
                    completed=Count("id", filter=Q(status="done")),
                    pending=Count("id", filter=Q(status__in=["todo", "in_progress"])),
                )
            )

            return Response({
                "role": "admin",
                "total_tasks": tasks.count(),
                "todo": tasks.filter(status="todo").count(),
                "in_progress": tasks.filter(status="in_progress").count(),
                "done": tasks.filter(status="done").count(),
                "overdue_tasks": tasks.filter(
                    due_date__lt=now().date(),
                    status__in=["todo", "in_progress"]
                ).count(),
                "member_activity": list(member_activity)
            })

        else:
            tasks = Task.objects.filter(assigned_to=user)

            task_list = tasks.values(
                "title",
                "project__name",
                "status",
                "priority",
                "due_date"
            )

            return Response({
                "role": "member",
                "total_tasks": tasks.count(),
                "todo": tasks.filter(status="todo").count(),
                "in_progress": tasks.filter(status="in_progress").count(),
                "done": tasks.filter(status="done").count(),
                "overdue_tasks": tasks.filter(
                    due_date__lt=now().date(),
                    status__in=["todo", "in_progress"]
                ).count(),
                "my_tasks": list(task_list)
            })