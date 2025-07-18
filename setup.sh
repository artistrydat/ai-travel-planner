#!/bin/bash

# AI Travel Planner - Setup Script
echo "🚀 Setting up AI Travel Planner..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install workspace dependencies
echo "📦 Installing workspace dependencies..."
npm install --workspaces

# Check if convex is configured
if [ ! -f "convex.json" ]; then
    echo "⚠️  Convex not configured. Please run 'npx convex init' and configure your deployment."
else
    echo "✅ Convex configuration found"
fi

# Generate Convex types
echo "🔄 Generating Convex types..."
npx convex codegen

# Check environment files
echo "🔍 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  Root .env.local not found. Copying from .env.example..."
    cp .env.example .env.local
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "⚠️  Web app .env.local not found. Copying from .env.example..."
    cp apps/web/.env.example apps/web/.env.local
fi

if [ ! -f "apps/dashboard/.env.local" ]; then
    echo "⚠️  Dashboard .env.local not found. Copying from .env.example..."
    cp apps/dashboard/.env.example apps/dashboard/.env.local
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure your environment variables in the .env.local files"
echo "2. Get your API keys:"
echo "   - Google Gemini API: https://makersuite.google.com/app/apikey"
echo "   - Google Maps API: https://console.cloud.google.com"
echo "   - Telegram Bot Token: https://t.me/botfather"
echo "3. Deploy your Convex backend: npx convex deploy"
echo "4. Start development: npm run dev"
echo ""
echo "🚀 For Vercel Deployment:"
echo "   - Deploy the 'apps/web' folder to Vercel"
echo "   - Root Directory: apps/web"
echo "   - Framework Preset: Next.js"
echo "   - Add environment variables in Vercel dashboard"
echo ""
echo "⚠️  Important: Do NOT delete any folders - everything is needed!"
echo "🌟 Happy coding!"
