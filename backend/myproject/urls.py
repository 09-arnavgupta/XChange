from django.contrib import admin
from django.urls import path, include, re_path
from .views import ReactAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),
    path('', include('listings.urls')),  # ✅ move this before re_path
    
    # fallback to React — keep this **at the bottom**
    re_path(r'^.*$', ReactAppView.as_view(), name='react-app'),
]
