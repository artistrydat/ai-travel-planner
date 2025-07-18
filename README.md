# AI Travel Planner

An AI-powered travel planner that creates detailed itineraries based on your preferences, with both a web application and Telegram bot dashboard.

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
- **Google Gemini API Key**
- **Google Maps API Key** 
- **Telegram Bot Token** (for bot functionality)
- **Convex Account** (free tier available)

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

## 🔧 Configuration

### Getting API Keys

#### 1. Google Gemini API Key
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add to your environment files

#### 2. Google Maps API Key
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Enable Maps JavaScript API and Places API
- Create credentials and restrict to your domains

#### 3. Telegram Bot Token
- Message [@BotFather](https://t.me/botfather) on Telegram
- Create a new bot with `/newbot`
- Copy the provided token

#### 4. Convex Setup
- Visit [Convex Dashboard](https://dashboard.convex.dev)
- Create a new project
- Copy your deployment URL

## 📱 Usage

### Web Application
1. **Plan Your Trip**: Enter destination, dates, budget, and preferences
2. **AI Generation**: Let Gemini AI create a personalized itinerary
3. **Interactive Map**: Explore your itinerary on Google Maps
4. **Telegram Integration**: Access through Telegram Web App
5. **Export & Share**: Download your itinerary for offline use

### Analytics Dashboard
1. **Real-time Monitoring**: Track bot usage and user interactions
2. **Revenue Analytics**: Monitor credit purchases and usage patterns  
3. **User Insights**: Analyze user behavior and popular destinations
4. **Transaction Management**: View purchases, refunds, and credit history

## 🏗️ Architecture Highlights

### State Management with Zustand
- **Lightweight**: Minimal boilerplate, maximum performance
- **TypeScript Native**: Full type safety across stores
- **Persistence**: Automatic localStorage synchronization
- **Modular Stores**: Separated concerns (user, itinerary, preferences, UI)

### Data Layer with TanStack Query + Convex
- **Real-time Synchronization**: Live updates across all clients
- **Optimistic Updates**: Immediate UI feedback with rollback
- **Background Refetching**: Keep data fresh automatically
- **Caching Strategy**: Intelligent cache invalidation and updates

### Telegram Web App Integration
- **Native Experience**: Seamless integration with Telegram UI
- **Authentication**: Secure user verification through Telegram
- **Theme Integration**: Matches user's Telegram theme preferences
- **Haptic Feedback**: Native mobile interactions

## 🔄 Build and Deploy

### Local Development
```bash
npm run dev:web       # Web app on http://localhost:3000
npm run dev:dashboard # Dashboard on http://localhost:5173
```

### Production Deployment

#### 1. Deploy Convex Backend First
```bash
npx convex deploy --prod
# Copy the generated URL for environment variables
```

#### 2. Deploy Web App to Vercel

**Option A: Vercel CLI**
```bash
cd apps/web
vercel --prod
```

**Option B: Vercel Dashboard**
- Import repository from GitHub
- Set **Root Directory** to `apps/web`
- Framework: Next.js (auto-detected)
- Add environment variables:
  ```
  NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.site
  GOOGLE_GEMINI_API_KEY=your_api_key
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
  ```

#### 3. Deploy Dashboard (Optional)
```bash
cd apps/dashboard
npm run build
# Deploy 'dist' folder to any static hosting (Netlify, Vercel, etc.)
```

### Important Deployment Notes
- ⚠️ **Deploy `apps/web` folder, NOT the root directory**
- ✅ **Deploy Convex backend before frontend**
- ✅ **Set environment variables in Vercel dashboard**
- ❌ **Don't delete any folders - everything is needed**

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📊 Key Features Deep Dive

### AI-Powered Itinerary Generation
- **Context-Aware**: Considers user preferences, budget, and travel style
- **Local Insights**: Integrates real-time local information and events
- **Customizable**: Easily modify generated plans with AI assistance
- **Multi-Language**: Supports multiple languages for international users

### Credit System & Monetization
- **Flexible Pricing**: Credit-based system for premium features
- **Telegram Payments**: Native payment integration through Telegram
- **Usage Tracking**: Detailed analytics for credit consumption
- **Refund Management**: Built-in refund system for customer satisfaction

### Real-time Analytics
- **Live Dashboards**: Real-time updates using Convex subscriptions
- **Performance Metrics**: Track response times and user satisfaction
- **Business Intelligence**: Revenue trends and user behavior insights
- **Scalable Architecture**: Handles high-volume analytics efficiently

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- **TypeScript**: Maintain strict type safety
- **Testing**: Write tests for new features
- **Documentation**: Update docs for any API changes
- **Performance**: Consider mobile and slow network conditions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

#### Convex Connection Issues
```bash
# Regenerate Convex types
npx convex codegen

# Reset Convex cache
rm -rf .convex
npx convex dev
```

#### Build Errors
```bash
# Clear all caches
npm run clean
npm install
npm run build
```

#### Environment Variables
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify API keys are valid and have proper permissions

### Getting Help
1. **Check Issues**: Search existing GitHub issues
2. **Documentation**: Review the comprehensive docs
3. **Community**: Join our Discord community
4. **Support**: Create detailed issue reports with reproduction steps

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful AI capabilities
- **Convex** for real-time backend infrastructure  
- **Next.js Team** for the incredible framework
- **Zustand** for elegant state management
- **TanStack Query** for data synchronization
- **Telegram** for Web App platform
- **Tailwind CSS** for beautiful, responsive styling

---

**Built with ❤️ by the AI Travel Planner Team**