from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer
from .models import ProjectMember


class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        members = ProjectMember.objects.filter(project_id=pk)

        data = []
        for m in members:
            data.append({
                "id": m.user.id,
                "username": m.user.username,
                "role": m.role
            })

        return Response(data)
    

class AddMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Only admin can add members"}, status=403)

        user_id = request.data.get("user_id") or request.data.get("user")
        role = request.data.get("role", "member")

        if not user_id:
            return Response({"error": "User id required"}, status=400)

        if ProjectMember.objects.filter(project_id=pk, user_id=user_id).exists():
            return Response({"error": "User already member"}, status=400)

        ProjectMember.objects.create(
            project_id=pk,
            user_id=user_id,
            role=role
        )

        return Response({"message": "Member added successfully"}, status=201)

class ProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):

        if request.user.role != 'admin':
            return Response (
                {"error": "Only admin can create project"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            project = serializer.save(created_by=request.user)

            ProjectMember.objects.create(
                project=project,
                user=request.user,
                role='admin'
            )

            return Response(
                {"message": "Project created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        serializer = ProjectSerializer(project, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project updated", "data": serializer.data})

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        project.delete()
        return Response({"message": "Project deleted"})
    

class ProjectMemberDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, project_id, user_id):
        if request.user.role != "admin":
            return Response({"error": "Only admin can remove members"}, status=403)

        try:
            member = ProjectMember.objects.get(
                project_id=project_id,
                user_id=user_id
            )
        except ProjectMember.DoesNotExist:
            return Response({"error": "Member not found"}, status=404)

        if member.user == request.user:
            return Response({"error": "Admin cannot remove himself"}, status=400)

        member.delete()
        return Response({"message": "Member removed successfully"})