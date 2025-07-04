from django.db import models

# Create your models here.

class Listing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    expected_item = models.CharField(max_length=255)
    cash_value = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    