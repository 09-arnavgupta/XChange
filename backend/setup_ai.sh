#!/bin/bash

# XChange AI Setup Script
echo "🚀 Setting up XChange AI-Enhanced Barter Platform"
echo "=================================================="

# Check if we're in the backend directory
if [ ! -f "manage.py" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements_ai.txt

# Install Ollama (optional for local LLM hosting)
echo "🤖 Installing Ollama (optional, for local LLM hosting)..."
read -p "Do you want to install Ollama for local LLM hosting? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "🔄 Pulling Mistral model..."
    ollama pull mistral
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p media/uploads
mkdir -p static/ai_models

# Run Django migrations
echo "🔄 Running Django migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser..."
read -p "Do you want to create a superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your API keys to backend/.env file"
echo "2. Run: python manage.py runserver"
echo "3. In another terminal, run the frontend: npm start"
echo ""
echo "🎯 Your AI-powered barter platform is ready!"
