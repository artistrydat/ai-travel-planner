# 🚀 Deployment Guide

This guide will walk you through deploying your AI Travel Planner to production safely.

## 📋 Pre-Deployment Checklist

### ⚠️ IMPORTANT: Do NOT Delete Any Folders Manually!
- ✅ Keep `apps/web/` (your Next.js app for Vercel)
- ✅ Keep `apps/dashboard/` (analytics dashboard)
- ✅ Keep `convex/` (your backend database)
- ✅ Keep `shared/` (common types)
- ❓ **Old `frontend/` folder**: Use the cleanup script to safely remove it

## 🔧 Step 0: Clean Up Old Files (If Needed)

If you see an old `frontend/` folder, run the cleanup script:

```bash
# Make sure you're in the project root
cd /Users/Muhanned/Desktop/nextjs---ai-travel-planner

# Run the cleanup script
./cleanup.sh
```

This will safely remove any leftover duplicate files without breaking your code.

## 🔧 Step 1: Run Setup Script

Run the setup script to ensure everything is configured:

```bash
# Run the setup script
./setup.sh
```

This will:
- Install all dependencies
- Generate Convex types
- Create environment files
- Check configuration

## 🌐 Step 2: Deploy Convex Backend

Before deploying the frontend, deploy your backend:

```bash
# Deploy Convex backend to production
npx convex deploy --prod

# Copy the deployment URL that's generated
# You'll need this for the next steps
```

## 🚀 Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Navigate to the web app folder:**
```bash
cd apps/web
```

3. **Deploy to Vercel:**
```bash
vercel --prod
```

4. **Configure during deployment:**
   - **Root Directory**: Leave as `./` (you're already in apps/web)
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Option B: Using Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import from Git:**
   - Connect your GitHub repository
   - Select the `ai-travel-planner` repository

4. **Configure Project Settings:**
   ```
   Project Name: ai-travel-planner-web
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Environment Variables (Add these in Vercel dashboard):**
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.site
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

## 📱 Step 4: Deploy Dashboard (Optional)

If you want to deploy the analytics dashboard:

### For Netlify:
```bash
cd apps/dashboard
npm run build
# Upload the 'dist' folder to Netlify
```

### For Vercel:
```bash
cd apps/dashboard
vercel --prod
```

Configure as:
- **Framework**: Vite
- **Root Directory**: apps/dashboard
- **Build Command**: npm run build
- **Output Directory**: dist

## 🔐 Step 5: Environment Variables Setup

### For Web App (Vercel):
```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.site
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### For Dashboard:
```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.site
```

## 🧪 Step 6: Test Your Deployment

1. **Test the web app:**
   - Visit your Vercel URL
   - Try creating an itinerary
   - Check if maps are working
   - Test Telegram integration

2. **Test the dashboard:**
   - Visit your dashboard URL
   - Check if analytics are loading
   - Verify real-time updates

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Module not found" errors
**Solution:** Make sure you're deploying the correct folder (`apps/web`)

#### 2. Environment variables not working
**Solution:** 
- Check variable names (NEXT_PUBLIC_ prefix for client-side)
- Verify they're set in Vercel dashboard
- Redeploy after adding variables

#### 3. Convex connection issues
**Solution:**
- Ensure Convex is deployed: `npx convex deploy --prod`
- Check the URL in environment variables
- Verify API access in Convex dashboard

#### 4. Build failures
**Solution:**
```bash
# Test build locally first
cd apps/web
npm run build

# If it works locally, check Vercel build logs
```

## 📂 Project Structure After Deployment

```
ai-travel-planner/                 # Your local development
├── apps/
│   ├── web/                      # 👈 This gets deployed to Vercel
│   └── dashboard/                # 👈 This can be deployed separately
├── convex/                       # 👈 This is your backend (deployed to Convex)
└── ...

🌐 Production URLs:
├── Web App: https://your-app.vercel.app
├── Dashboard: https://your-dashboard.vercel.app (optional)
└── Backend: https://your-deployment.convex.site
```

## ⚡ Quick Deployment Commands

```bash
# 1. Deploy backend
npx convex deploy --prod

# 2. Deploy web app
cd apps/web
vercel --prod

# 3. Deploy dashboard (optional)
cd ../dashboard
vercel --prod
```

# 📋 Deployment Checklist

Follow this checklist for successful deployment:

## ✅ Pre-Deployment
- [ ] Run `./setup.sh` to ensure everything is configured
- [ ] Test locally with `npm run dev:web`
- [ ] Ensure all environment variables are set
- [ ] Commit and push your code to GitHub

## ✅ Backend Deployment
- [ ] Deploy Convex: `npx convex deploy --prod`
- [ ] Copy the generated Convex URL
- [ ] Test backend in Convex dashboard

## ✅ Frontend Deployment (Vercel)
- [ ] Go to Vercel Dashboard
- [ ] Import GitHub repository
- [ ] Set **Root Directory** to `apps/web`
- [ ] Set Framework to **Next.js**
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_CONVEX_URL`
  - [ ] `GOOGLE_GEMINI_API_KEY`
  - [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Deploy and test

## ✅ Post-Deployment
- [ ] Test the live web app
- [ ] Verify Telegram integration works
- [ ] Check Google Maps functionality
- [ ] Test AI itinerary generation
- [ ] Monitor for any errors

## 🚨 Important Reminders
- ❌ **DO NOT** delete any folders
- ✅ Deploy `apps/web` folder specifically
- ✅ Deploy Convex before frontend
- ✅ Use environment variables for all secrets

## 🔧 Quick Commands
```bash
# Deploy backend
npx convex deploy --prod

# Deploy web app (from apps/web folder)
cd apps/web && vercel --prod
```


## 🔄 Future Updates

When you make changes:

1. **For backend changes:**
```bash
npx convex deploy --prod
```

2. **For web app changes:**
```bash
cd apps/web
vercel --prod
```

3. **For development:**
```bash
# Always use the root commands
npm run dev:web      # or
npm run dev:dashboard
```

## 🚨 What NOT to Do

❌ **Don't delete any folders** - everything is connected
❌ **Don't deploy the root folder** - deploy `apps/web` specifically  
❌ **Don't change import paths** - they're configured for the monorepo
❌ **Don't deploy without Convex backend** - deploy Convex first

## ✅ Best Practices

✅ **Always test locally first** with `npm run dev`
✅ **Deploy Convex before frontend** 
✅ **Use environment variables** for all secrets
✅ **Test after each deployment**
✅ **Keep backups** of working deployments

Your organized structure is deployment-ready! Just follow these steps and you'll have a successful deployment without breaking anything. 🎉
