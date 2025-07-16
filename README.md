# AI Travel Planner

An AI-powered travel planner that creates detailed itineraries based on your preferences, with both a web application and Telegram bot interface.

## 🚀 Features

- **AI-Powered Itinerary Generation**: Creates detailed travel plans using Google's Gemini AI
- **Interactive Map Interface**: Visualize your travel plans on an interactive map
- **Telegram Bot Integration**: Access travel planning through a Telegram bot
- **Export Functionality**: Export generated plans for offline use
- **Real-time Dashboard**: Monitor bot usage and analytics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

This project consists of two main applications:

### Frontend (Next.js Web App)
- **Framework**: Next.js 14.2.5 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Integration**: Google Gemini AI, Telegram Web App SDK
- **Query Management**: TanStack React Query

### Bot (Telegram Bot Dashboard)
- **Framework**: Vite + React with TypeScript
- **Backend**: Convex for real-time data
- **Charts**: Recharts for analytics visualization
- **Styling**: Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- Next.js 14.2.5
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- TanStack React Query
- Google Gemini AI
- Telegram Web App SDK

### Bot Dashboard
- Vite
- React 18
- TypeScript
- Convex (Backend)
- Recharts (Charts)
- Tailwind CSS

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key
- Telegram Bot Token (for bot functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd nextjs---ai-travel-planner
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Bot Dashboard Setup

```bash
cd ../Bot
npm install
```

Create a `.env.local` file in the Bot directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the development server:
```bash
npm run dev
```

The bot dashboard will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Bot (.env.local)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

1. **Google Gemini API Key**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env.local` files

2. **Telegram Bot Token** (if using bot features):
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Create a new bot
   - Copy the token

## 📱 Usage

### Web Application
1. Open the frontend application
2. Enter your travel preferences (destination, dates, budget, etc.)
3. Let the AI generate a personalized itinerary
4. View your itinerary on the interactive map
5. Export your plan for offline use

### Telegram Bot
1. Access the bot dashboard to monitor usage
2. View analytics and user interactions
3. Manage bot settings and responses

## 🏗️ Build and Deploy

### Frontend (Next.js)
```bash
cd frontend
npm run build
npm start
```

### Bot Dashboard (Vite)
```bash
cd Bot
npm run build
npm run preview
```

## 📊 Features Overview

- **AI Itinerary Generation**: Powered by Google Gemini AI
- **Interactive Maps**: Visual representation of travel plans
- **Multi-platform**: Web app and Telegram bot
- **Real-time Analytics**: Bot usage tracking and insights
- **Export Options**: Download itineraries for offline use
- **Responsive Design**: Optimized for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling
- Convex for real-time backend services