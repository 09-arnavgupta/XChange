from django.urls import path
from . import views
from .views import UserListView
from django.http import JsonResponse

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "This is users backend!"})),
    path('api/users/', UserListView.as_view(), name='user-list')
]