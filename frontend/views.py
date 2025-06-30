from django.shortcuts import render

# Create your views here.

def index(request, *args, **kwargs):
    """
    Render the index page.
    """
    return render(request, 'frontend/index.html')
