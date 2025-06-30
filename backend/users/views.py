from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
# /hello  # These are end points (location on web server where we're going to)?
# /hi 


def main(request):
    return HttpResponse("<h1>Hello</h1>")
