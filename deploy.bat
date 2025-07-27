@echo off
echo 🚀 FJ Website Deployment Script
echo ================================

echo 📦 Installing dependencies...
call pnpm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🔨 Building the application...
call pnpm build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🎯 Next steps:
    echo 1. Push your code to GitHub
    echo 2. Connect to Vercel
    echo 3. Add environment variables in Vercel
    echo 4. Deploy!
    echo.
    echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
) else (
    echo ❌ Build failed! Please fix the errors above before deploying.
)

pause 