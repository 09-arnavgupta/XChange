# listings/urls.py
from django.urls import path
from .views import ListingListCreateView, ListingDetailView, AIAgentView

urlpatterns = [
    path('create/', ListingListCreateView.as_view(), name='listings'),
    path('getlistings/', ListingListCreateView.as_view(), name='listings-list'),
    path('listings/<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
    path('ai-agent/', AIAgentView.as_view()), 
]
