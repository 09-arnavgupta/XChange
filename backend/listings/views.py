# listings/views.py
from rest_framework import generics
from .models import Listing
from .serializers import ListingSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()
    
    print("Done")

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
