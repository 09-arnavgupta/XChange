from django.urls import path
from . import views
from .views import UserListView, RegisterView, UserDetailView
from django.http import JsonResponse
# from rest_framework_simplejwt.views import TokenObtainPairView
from .views import CustomTokenObtainPairView


urlpatterns = [
    path('', lambda request: JsonResponse({"message": "This is users backend!"})),
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('register/', RegisterView.as_view()),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('<str:username>/', UserDetailView.as_view()),
]