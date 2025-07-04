from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# class User(models.Model):
#     usrname = models.CharField(max_length=100, unique=True)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=100)
#     first_name = models.CharField(max_length=100, blank=True)
#     last_name = models.CharField(max_length=100, blank=True)
#     phone_num = models.IntegerField(blank=True, null=True)
#     num_of_exchanges = models.IntegerField(default=0)
#     integrity_score = models.FloatField(default=0.0)
#     is_verified = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     location = models.CharField(max_length=255, blank=True)
#     interests = models.TextField(blank=True)


class CustomUser(AbstractUser):
    location = models.CharField(max_length=100, blank=True)
    interests = models.TextField(blank=True)
    intent = models.CharField(max_length=100, blank=True)  # e.g., "exchange", "give away"