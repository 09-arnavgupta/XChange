from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_staff', 'location', 'intent')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('location', 'interests', 'intent')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)