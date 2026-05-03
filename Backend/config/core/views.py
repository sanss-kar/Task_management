from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer
from django.contrib.auth import get_user_model


User = get_user_model()

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response



class UsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().values("id", "username", "email", "role")
        return Response(list(users))


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "role": user.role,
            "email": user.email
        })
    

class SignupView(APIView):


    def get(self, request):
        users = User.objects.all().values('id', 'username', 'email', 'role')
        return Response(users)
    
    def post(self, request):
        serializer = SignupSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message" : "User created successfully",
                "status" : 200
            })
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


