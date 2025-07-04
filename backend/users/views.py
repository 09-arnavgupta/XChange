from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response

class UserListView(APIView):
    def get(self, request):
        return Response({"users": ["user1", "user2", "user3"]})