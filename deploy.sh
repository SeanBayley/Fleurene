#!/bin/bash

echo "🚀 FJ Website Deployment Script"
echo "================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🔨 Building the application..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect to Vercel"
    echo "3. Add environment variables in Vercel"
    echo "4. Deploy!"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Build failed! Please fix the errors above before deploying."
    exit 1
fi 