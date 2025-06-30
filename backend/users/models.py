from django.db import models

# Create your models here.

# We create models instead of tables in django

class User(models.Model):
    user = models.TextField(("User"), max_length=100, unique=True)
