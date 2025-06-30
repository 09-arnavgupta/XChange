from django.db import models

# Create your models here.

class Exchange(models.Model):
    offered_listing = models.ForeignKey('listings.Listing', on_delete=models.CASCADE, related_name='offered_exchanges')
    requested_listing = models.ForeignKey('listings.Listing', on_delete=models.CASCADE, related_name='requested_exchanges')
    sender = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sent_exchanges')
    receiver = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='received_exchanges')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed')
    ], default='pending')
    cash_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    done_at = models.DateTimeField(auto_now_add=True)
