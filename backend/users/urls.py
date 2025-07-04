from django.urls import path
from . import views
from django.http import JsonResponse

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "This is users backend!"}))
]