from django.urls import path
from .ai_agent import AIAgentView

urlpatterns = [
    # ...other endpoints...
    path('ai-agent/', AIAgentView.as_view(), name='ai-agent'),
]