from django.contrib import admin
from django.urls import path, include, re_path
from .views import ReactAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),  
    path('listings/', include('listings.urls')),  
    path('exchange/', include('exchange.urls')),
    # fallback to React — keep this **at the bottom**
    re_path(r'^.*$', ReactAppView.as_view(), name='react-app'),
]
