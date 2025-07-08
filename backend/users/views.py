from django.shortcuts import render

# DRF imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser

from rest_framework_simplejwt.views import TokenObtainPairView

# Import your serializer
from .serializers import RegisterSerializer
from .models import CustomUser


class UserListView(APIView):
    def get(self, request):
        return Response({"users": ["user1", "user2", "user3"]})


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # ✅ Saves to PostgreSQL
            return Response({"msg": "User registered"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = CustomUser.objects.get(username=username)
            serializer = RegisterSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data.get('access')
            refresh = response.data.get('refresh')
            # Set cookies
            response.set_cookie(
                key='access',
                value=access,
                httponly=True,
                secure=False,  # Set to True in production (HTTPS)
                samesite='Lax',
                path='/'  
            )
            response.set_cookie(
                key='refresh',
                value=refresh,
                httponly=True,
                secure=False,  # Set to True in production (HTTPS)
                samesite='Lax',
                path='/'
            )
            # Optionally remove tokens from response body
            response.data.pop('access', None)
            response.data.pop('refresh', None)
        return response