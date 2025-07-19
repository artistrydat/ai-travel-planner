# AI Travel Planner

An AI-powered travel planner that creates detailed itineraries based on your preferences, with both a web application and Tele## 📚 Documentation

- **🤖 Telegram Integration**: See [TELEGRAM_AUTH.md](./Docs/TELEGRAM_AUTH.md) for complete Telegram WebApp setup
- **🚀 Deployment Guide**: See [DEPLOYMENT.md](./Docs/DEPLOYMENT.md) for production deployment
- **📄 Export Functionality**: See [EXPORT_FUNCTIONALITY.md](./Docs/EXPORT_FUNCTIONALITY.md) for file export system and platform compatibility
- **🔧 Configuration**: All API keys and environment variables detailed in docsbot dashboard.

## 🚀 Features

- **AI-Powered Itinerary Generation**: Creates detailed travel plans using Google's Gemini AI
- **Interactive Map Interface**: Visualize your travel plans on an interactive map
- **Telegram Bot Integration**: Access travel planning through a Telegram bot
- **Real-time Analytics Dashboard**: Monitor bot usage and analytics with live data
- **Export Functionality**: Export generated plans for offline use
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Credit System**: Built-in credit management for premium features

## 🏗️ Project Structure

This is a modern monorepo structured for scalability and maintainability:

```
ai-travel-planner/
├── apps/
│   ├── web/                    # Next.js Web Application
│   │   ├── app/                # Next.js 14 App Router
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks (TanStack Query)
│   │   ├── lib/                # Utilities and services
│   │   ├── store/              # Zustand state management
│   │   └── types.ts            # TypeScript types
│   └── dashboard/              # Vite Dashboard Application
│       ├── components/         # React components for analytics
│       ├── App.tsx             # Main dashboard app
│       └── index.tsx           # Entry point with Convex provider
├── convex/                     # Centralized Backend (Convex)
│   ├── schema.ts               # Database schema
│   ├── queries.ts              # Database queries
│   ├── mutations.ts            # Database mutations
│   └── _generated/             # Auto-generated types and API
├── shared/                     # Shared utilities and types
│   └── types.ts                # Common TypeScript types
├── Docs/                       # Documentation
│   ├── TELEGRAM_AUTH.md        # Telegram integration guide
│   └── DEPLOYMENT.md           # Deployment instructions
├── package.json                # Root package.json (workspace manager)
└── convex.json                 # Convex configuration
```

## 🛠️ Tech Stack

### Core Technologies
- **Backend**: [Convex](https://convex.dev) - Real-time database with built-in auth
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) - Advanced AI for itinerary generation
- **Telegram Integration**: [Telegram Web App SDK](https://core.telegram.org/bots/webapps) - Native Telegram bot integration

### Web Application (Next.js)
- **Framework**: Next.js 14.2.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API with advanced markers
- **Authentication**: Telegram Web App authentication

### Analytics Dashboard (Vite)
- **Framework**: Vite + React 18
- **Language**: TypeScript  
- **Charts**: Recharts for data visualization
- **Styling**: Tailwind CSS
- **Real-time Updates**: Convex subscriptions

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** - [Get here](https://makersuite.google.com/app/apikey)
- **Google Maps API Key** - [Get here](https://console.cloud.google.com)
- **Telegram Bot Token** - Message [@BotFather](https://t.me/botfather)
- **Convex Account** - [Sign up](https://dashboard.convex.dev) (free tier available)

## 🚀 Getting Started

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd ai-travel-planner
npm install
```

### 2. Environment Configuration

Copy environment files and configure them:

```bash
# Root environment
cp .env.example .env.local

# Web app environment  
cp apps/web/.env.example apps/web/.env.local

# Dashboard environment
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

Configure your environment variables:

**Root `.env.local`:**
```env
CONVEX_DEPLOYMENT=https://your-convex-deployment.convex.site
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

**Web App `apps/web/.env.local`:**
```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.site
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Dashboard `apps/dashboard/.env.local`:**
```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.site
```

### 3. Initialize Convex Backend

```bash
# Deploy your schema to Convex
npx convex deploy

# For development with live reload
npx convex dev
```

### 4. Development

Start both applications in development mode:

```bash
# Start all apps
npm run dev

# Or start individually
npm run dev:web        # Web app on http://localhost:3000
npm run dev:dashboard  # Dashboard on http://localhost:5173
```

## � Documentation

- **🤖 Telegram Integration**: See [TELEGRAM_AUTH.md](./Docs/TELEGRAM_AUTH.md) for complete Telegram WebApp setup
- **🚀 Deployment Guide**: See [DEPLOYMENT.md](./Docs/DEPLOYMENT.md) for production deployment
- **🔧 Configuration**: All API keys and environment variables detailed in docs

## 🔄 Quick Commands

```bash
# Development
npm run dev                 # Start all apps
npm run dev:web            # Web app only
npm run dev:dashboard      # Dashboard only

# Production
npx convex deploy --prod   # Deploy backend
cd apps/web && vercel --prod   # Deploy web app

# Utilities
npm run build              # Build all apps
npm run clean              # Clean caches
```

## 🏗️ Architecture Highlights

- **Monorepo Structure**: Clean separation of concerns
- **Real-time Data**: Convex subscriptions for live updates
- **Type Safety**: Full TypeScript integration
- **State Management**: Zustand for local state, TanStack Query for server state
- **Telegram Native**: Seamless Telegram WebApp integration
- **AI-Powered**: Google Gemini for intelligent itinerary generation

## 🚀 Deployment

**Quick Deploy:**
1. Deploy backend: `npx convex deploy --prod`
2. Deploy web app: Deploy `apps/web` folder to Vercel
3. Set environment variables in Vercel dashboard

**⚠️ Important**: Deploy the `apps/web` folder specifically, not the root directory.

For detailed deployment instructions, see [DEPLOYMENT.md](./Docs/DEPLOYMENT.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Search existing GitHub issues
- **Documentation**: Check [Docs/](./Docs/) folder
- **Telegram Setup**: See [TELEGRAM_AUTH.md](./Docs/TELEGRAM_AUTH.md)
- **Export Issues**: See [EXPORT_FUNCTIONALITY.md](./Docs/EXPORT_FUNCTIONALITY.md)
- **Deployment Help**: See [DEPLOYMENT.md](./Docs/DEPLOYMENT.md)

---

**Built with ❤️ by the AI Travel Planner Team**