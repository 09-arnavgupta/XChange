# listings/urls.py
from django.urls import path
from .views import ListingListCreateView, ListingDetailView

urlpatterns = [
    path('api/listings/', ListingListCreateView.as_view(), name='listings'),
    path('api/listings/<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
]
