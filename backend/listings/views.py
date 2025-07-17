# listings/views.py
from rest_framework import generics
from .models import Listing
from .serializers import ListingSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()
    
    print("Done")

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer



# AI Agent-
import json
import os
import io
from PIL import Image
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import BlipProcessor, BlipForConditionalGeneration

from langchain_groq.chat_models import ChatGroq
from langchain.prompts import ChatPromptTemplate

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def generate_caption(image):
    inputs = processor(image, return_tensors="pt")
    out = model.generate(**inputs)
    return processor.decode(out[0], skip_special_tokens=True)

class AIAgentView(APIView):
    def post(self, request):
        images = request.FILES.getlist("images")
        title = request.POST.get("title", "")

        if not images:
            return Response({"error": "At least one image is required."}, status=400)

        # 🧠 Generate image captions
        captions = []
        for img in images:
            try:
                image_pil = Image.open(img).convert('RGB')
                captions.append(generate_caption(image_pil))
            except Exception as e:
                print("Error generating caption:", e)
                captions.append("")

        joined_caption = " ".join([c for c in captions if c.strip()])

        # 🧠 Groq LLM with LangChain
        llm = ChatGroq(
            temperature=0.4,
            model_name="gemma2-9b-it",  # ✅ Supported production model
            max_tokens=250  # 👈 Limits the length of response
        )

        prompt = ChatPromptTemplate.from_template("""
You are a smart listing assistant. A user is uploading an item for exchange.

Image Captions: {captions}
Title: {title}

Generate:
1. A concise and helpful description (max 60 words).
2. 4–6 relevant tags for this item. Output them as a list.

Respond ONLY in JSON like:
{{"description": "...", "tags": ["tag1", "tag2", ...]}}
""")

        try:
            chain = prompt | llm
            result = chain.invoke({"captions": joined_caption, "title": title})

            print("LLM Raw Output:", result.content)  # 🪵 For debug

            data = json.loads(result.content)
            return Response({"features": data})
        except json.JSONDecodeError:
            return Response({"error": "Invalid response format from AI"}, status=500)
        except Exception as e:
            print("Unexpected AI error:", str(e))
            return Response({"error": "Unexpected error", "details": str(e)}, status=500)