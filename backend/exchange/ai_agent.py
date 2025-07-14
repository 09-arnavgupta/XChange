# backend/exchange/ai_agent.py

from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import HuggingFacePipeline
from langchain_community.llms import Ollama
from langgraph.graph import StateGraph
from PIL import Image
import io
import torch
from transformers import Blip2Processor, Blip2ForConditionalGeneration, AutoTokenizer, AutoModelForCausalLM
import requests
import base64

# Initialize BLIP-2 for image understanding (FIXED)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Use Blip2Processor instead of BlipProcessor and lazy loading to avoid startup issues
blip_processor = None
blip_model = None

def get_blip_models():
    """Lazy loading of BLIP models to avoid startup issues"""
    global blip_processor, blip_model
    if blip_processor is None or blip_model is None:
        try:
            # Use Blip2Processor for BLIP-2 models
            blip_processor = Blip2Processor.from_pretrained(
                "Salesforce/blip2-opt-2.7b",
                use_fast=False  # Use slow tokenizer to avoid the normalizer issue
            )
            blip_model = Blip2ForConditionalGeneration.from_pretrained(
                "Salesforce/blip2-opt-2.7b",
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
            ).to(device)
            print("BLIP-2 models loaded successfully")
        except Exception as e:
            print(f"Error loading BLIP-2 models: {e}")
            # Fallback to a simpler model if BLIP-2 fails
            try:
                from transformers import BlipProcessor, BlipForConditionalGeneration
                blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
                blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(device)
                print("Fallback to BLIP-1 model successful")
            except Exception as fallback_e:
                print(f"Fallback model also failed: {fallback_e}")
                blip_processor = None
                blip_model = None
    
    return blip_processor, blip_model

# Initialize Mistral for text generation (using Ollama for local hosting)
try:
    mistral_llm = Ollama(model="mistral")
except:
    # Fallback to HuggingFace if Ollama not available
    try:
        tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
        model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
        mistral_llm = HuggingFacePipeline.from_model_id(
            model_id="mistralai/Mistral-7B-Instruct-v0.1",
            task="text-generation",
            model_kwargs={"temperature": 0.3, "max_length": 512}
        )
    except Exception as e:
        print(f"Error loading Mistral model: {e}")
        # Use a simple mock LLM for testing
        class MockLLM:
            def __call__(self, prompt):
                return "Generated response"
        mistral_llm = MockLLM()

# 1. Enhanced Vision Model Tool with BLIP-2 (FIXED)
def extract_image_features(image_bytes):
    """Extract comprehensive product details from image using BLIP-2"""
    try:
        processor, model = get_blip_models()
        
        # If models failed to load, return fallback data
        if processor is None or model is None:
            print("BLIP models not available, using fallback")
            return {
                "tags": ["item", "product", "exchange"],
                "brand": "Generic",
                "category": "General",
                "condition": "Good",
                "description": "Product for exchange"
            }
        
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # For BLIP-2, we need to handle text prompts differently
        results = {}
        
        # Basic image captioning without prompt
        inputs = processor(image, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = model.generate(**inputs, max_length=50, num_beams=3)
        basic_description = processor.decode(outputs[0], skip_special_tokens=True)
        results["basic"] = basic_description
        
        # Try conditional generation with prompts (if supported)
        prompts = [
            "What brand is this?",
            "What is the condition of this item?",
            "What category does this belong to?"
        ]
        
        for prompt in prompts:
            try:
                inputs = processor(image, prompt, return_tensors="pt").to(device)
                with torch.no_grad():
                    outputs = model.generate(**inputs, max_length=50, num_beams=3)
                response = processor.decode(outputs[0], skip_special_tokens=True)
                results[prompt] = response
            except Exception as prompt_e:
                print(f"Prompt '{prompt}' failed: {prompt_e}")
                results[prompt] = "Unknown"
        
        # Parse and structure the results
        tags = []
        brand = "Unknown"
        category = "General"
        condition = "Good"
        
        # Extract brand
        brand_response = results.get("What brand is this?", "").lower()
        if brand_response and brand_response != "unknown":
            brand_words = brand_response.split()
            if brand_words:
                brand = brand_words[-1].title()
        
        # Extract category from basic description
        item_desc = basic_description.lower()
        if any(word in item_desc for word in ["shoe", "sneaker", "boot", "sandal"]):
            category = "Shoes"
        elif any(word in item_desc for word in ["shirt", "jacket", "clothing", "dress", "pants"]):
            category = "Clothing"
        elif any(word in item_desc for word in ["phone", "electronic", "device", "computer", "laptop"]):
            category = "Electronics"
        elif any(word in item_desc for word in ["book", "novel", "magazine"]):
            category = "Books"
        elif any(word in item_desc for word in ["watch", "jewelry", "ring", "necklace"]):
            category = "Accessories"
        
        # Extract condition
        condition_response = results.get("What is the condition of this item?", "").lower()
        if any(word in condition_response for word in ["new", "excellent", "mint", "perfect"]):
            condition = "Excellent"
        elif any(word in condition_response for word in ["good", "fine", "decent", "nice"]):
            condition = "Good"
        elif any(word in condition_response for word in ["fair", "worn", "used", "damaged"]):
            condition = "Fair"
        
        # Extract tags from description
        desc_words = basic_description.split()
        tags = [word.strip(".,!?").lower() for word in desc_words if len(word) > 3][:5]
        
        return {
            "tags": tags,
            "brand": brand,
            "category": category,
            "condition": condition,
            "description": basic_description
        }
        
    except Exception as e:
        print(f"Error in image processing: {e}")
        # Fallback to mock data
        return {
            "tags": ["item", "product", "exchange"],
            "brand": "Generic",
            "category": "General",
            "condition": "Good",
            "description": "Product for exchange"
        }

# 2. LLM for Title/Description/Value using Mistral
llm = mistral_llm

title_prompt = PromptTemplate(
    input_variables=["tags", "brand", "category", "condition"],
    template="Generate a catchy marketplace title for a {brand} {category} in {condition} condition with these features: {tags}. Keep it under 60 characters."
)
desc_prompt = PromptTemplate(
    input_variables=["tags", "brand", "category", "condition"],
    template="Write a detailed, engaging description for a {brand} {category} in {condition} condition. Include these features: {tags}. Highlight what makes it valuable for trading."
)
value_prompt = PromptTemplate(
    input_variables=["brand", "category", "condition"],
    template="Estimate a fair market value in USD for a {brand} {category} in {condition} condition. Consider current market prices and depreciation. Provide only the dollar amount (e.g., $45)."
)

# Handle different LLM types
try:
    title_chain = LLMChain(llm=llm, prompt=title_prompt)
    desc_chain = LLMChain(llm=llm, prompt=desc_prompt)
    value_chain = LLMChain(llm=llm, prompt=value_prompt)
except Exception as e:
    print(f"Error creating LLM chains: {e}")
    # Create fallback chains
    class FallbackChain:
        def __init__(self, template):
            self.template = template
        
        def run(self, inputs):
            if "title" in self.template.lower():
                return f"{inputs['brand']} {inputs['category']} - {inputs['condition']} Condition"
            elif "description" in self.template.lower():
                return f"Quality {inputs['brand']} {inputs['category']} in {inputs['condition']} condition. Features: {', '.join(inputs['tags'])}. Perfect for trading!"
            elif "value" in self.template.lower():
                base_values = {"Electronics": 100, "Clothing": 30, "Shoes": 50, "Books": 15, "Accessories": 40}
                base = base_values.get(inputs['category'], 25)
                multiplier = {"Excellent": 1.2, "Good": 1.0, "Fair": 0.7}.get(inputs['condition'], 1.0)
                return f"${int(base * multiplier)}"
            return "Generated content"
    
    title_chain = FallbackChain("title")
    desc_chain = FallbackChain("description")
    value_chain = FallbackChain("value")

# 3. Enhanced Tool: Find Matches using AI similarity
def find_matches(item_info):
    """Find similar items in the database using AI-powered matching"""
    # In a real implementation, this would:
    # 1. Query your Django listings model
    # 2. Use embeddings to find similar items
    # 3. Score matches based on category, tags, condition
    
    # Mock implementation with intelligent matching logic
    category = item_info.get("category", "General")
    condition = item_info.get("condition", "Good")
    brand = item_info.get("brand", "Unknown")
    
    # Simulate database query results
    mock_matches = [
        {"id": 1, "title": f"Similar {category} Item", "value": 45, "condition": "Good"},
        {"id": 2, "title": f"{brand} Alternative", "value": 60, "condition": "Excellent"},
        {"id": 3, "title": f"Vintage {category}", "value": 35, "condition": "Fair"}
    ]
    
    # Filter matches based on category and condition compatibility
    compatible_matches = [
        match for match in mock_matches 
        if match["condition"] in ["Good", "Excellent"] or condition == "Fair"
    ]
    
    return compatible_matches[:3]  # Return top 3 matches

# 4. Enhanced Negotiation Node with LLM-driven logic
def negotiate_deal(user_expectation, matches, item_info):
    """Use LLM to generate intelligent negotiation suggestions"""
    if not matches:
        return "No suitable matches found for negotiation."
    
    try:
        # Create negotiation prompt
        negotiation_prompt = PromptTemplate(
            input_variables=["user_expectation", "matches", "item_condition", "item_category"],
            template="""
            Based on these available matches: {matches}
            User expects: {user_expectation}
            Item condition: {item_condition}
            Item category: {item_category}
            
            Suggest a fair trade or negotiation strategy. Be specific about which item to target and what offer to make.
            """
        )
        
        matches_text = ", ".join([f"{m['title']} (${m['value']})" for m in matches])
        
        try:
            negotiation_chain = LLMChain(llm=llm, prompt=negotiation_prompt)
            suggestion = negotiation_chain.run({
                "user_expectation": user_expectation or "Fair trade",
                "matches": matches_text,
                "item_condition": item_info.get("condition", "Good"),
                "item_category": item_info.get("category", "General")
            })
        except:
            # Fallback if LLM chain fails
            best_match = max(matches, key=lambda x: x["value"])
            suggestion = f"Consider trading for {best_match['title']} - it's a good match with ${best_match['value']} value"
        
        return suggestion
        
    except Exception as e:
        # Fallback negotiation logic
        best_match = max(matches, key=lambda x: x["value"])
        return f"Consider trading for {best_match['title']} - it's a good match with ${best_match['value']} value"

# 5. Enhanced LangGraph Workflow with Stateful Processing
def listing_node(state):
    image_bytes = state["image_bytes"]
    user_input = state.get("user_input", "")

    # Extract features from image
    features = extract_image_features(image_bytes)

    # Generate listing content
    try:
        title = title_chain.run(features)
        description = desc_chain.run(features)
        value = value_chain.run(features)
    except Exception as e:
        print(f"Error in LLM generation: {e}")
        # Fallback content generation
        title = f"{features['brand']} {features['category']} - {features['condition']}"
        description = f"Quality {features['brand']} {features['category']} in {features['condition']} condition."
        value = "$25"

    # Find matches
    matches = find_matches(features)

    # Generate negotiation strategy
    deal = negotiate_deal(user_input, matches, features)

    return {
        "features": features,
        "title": title.strip(),
        "description": description.strip(),
        "value": value.strip(),
        "matches": matches,
        "deal": deal,
    }

# Initialize the graph
try:
    state_schema = {
        "image_bytes": bytes,
        "user_input": str
    }
    graph = StateGraph(state_schema)
    graph.add_node("listing", listing_node)
    graph.add_edge("__start__", "listing")      # Set entrypoint
    graph.add_edge("listing", "__end__")        # Mark 'listing' as terminal node
    compiled_graph = graph.compile()
except Exception as e:
    print(f"Error initializing graph: {e}")
    # Create a simple fallback function
    def fallback_graph_run(state):
        return listing_node(state)
    compiled_graph = type('Graph', (), {'run': fallback_graph_run})()

# 6. Enhanced Django API View with Error Handling
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
# In your AIAgentView (backend/exchange/ai_agent.py)
class AIAgentView(APIView):
    def post(self, request):
        message = request.data.get("message", "").lower()
        tags = request.data.get("tags", [])
        if "find" in message:
            return Response({"reply": "What are you looking for? Please describe the item."})
        if "list" in message:
            return Response({"reply": "Please upload an image of your item."})
        if "image" in request.FILES:
            return Response({"reply": "Image received. Please enter a title and description."})
        if tags:
            return Response({"reply": f"Tags received: {', '.join(tags)}. Please enter price and exchange item you want."})
        # Add more logic for each step...
        return Response({"reply": "How can I help you next?"})