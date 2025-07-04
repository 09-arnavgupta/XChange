from django.shortcuts import render

# DRF imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

# Import your serializer
from .serializers import RegisterSerializer
from .models import CustomUser


class UserListView(APIView):
    def get(self, request):
        return Response({"users": ["user1", "user2", "user3"]})


class RegisterView(APIView):
    authentication_classes = []        
    permission_classes = [AllowAny]    

    # def post(self, request):
    #     serializer = RegisterSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"msg": "User registered"}, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        data = request.data
        # Just print it on server and send it back in response
        print("📦 Received data:", data)
        return Response({
            "msg": "Received data",
            "data": data
        }, status=status.HTTP_200_OK)