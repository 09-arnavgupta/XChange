from django.urls import path
from . import views
from .views import UserListView, RegisterView, UserDetailView
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    path('', lambda request: JsonResponse({"message": "This is users backend!"})),
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/<str:username>/', UserDetailView.as_view()),
]