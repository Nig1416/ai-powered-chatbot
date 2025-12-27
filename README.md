# AI-Powered Customer Support Chatbot

A modern, full-stack chatbot application featuring real-time communication, OpenAI GPT-4 integration, and an analytics dashboard.

## Tech Stack
- **Frontend**: React.js (Vite), Vanilla CSS (Glassmorphism), Chart.js
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **AI**: OpenAI GPT-4 API

## Features
- 💬 **Real-time Messaging**: Instant communication via Socket.io.
- 🤖 **AI Integration**: Automatic responses using GPT-4 with context awareness (last 10 messages).
- 📊 **Analytics Dashboard**: View total conversations, message stats, and sentiment analysis.
- 🎨 **Premium UI**: Dark mode, gradients, and smooth animations.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally (default port 27017)
- OpenAI API Key

### 1. Server Setup
```bash
cd server
npm install
# Create .env file with your API key
# OPENAI_API_KEY=sk-...
npm start
```
Server runs on `http://localhost:5000`.

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

## Environment Variables
See `server/.env.example` for required variables.
