# HabitFlow - Smart Habit Tracker with AI

## Project Overview

**HabitFlow** is a full-stack habit tracking web application that helps users build and maintain healthy habits using AI-powered insights.

**Tech Stack:**
- **Frontend:** React (plain JavaScript + pure CSS)
- **Backend:** Node.js (pure HTTP, no Express or other frameworks)
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI API with RAG (Retrieval Augmented Generation)

---

## 📁 Project Structure

```
HabitFlow/
├── src/                          # React Frontend (plain JS + CSS)
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   ├── styles.css                # All styles (pure CSS)
│   └── components/
│       ├── LoginPage.jsx         # Login/signup page
│       ├── Dashboard.jsx         # Main dashboard
│       ├── HabitList.jsx         # Habit management (CRUD)
│       ├── Statistics.jsx        # Charts and analytics
│       └── AIAssistant.jsx       # RAG-powered AI chat
│
├── backend/                      # Node.js Backend
│   ├── server.js                 # HTTP server (pure Node.js)
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── supabase-schema.sql       # Database schema
│
├── index.html                    # HTML entry point
├── package.json                  # Frontend dependencies
└── vite.config.js                # Vite build configuration
```

---

## 🚀 How to Run

### Prerequisites
- Node.js version 18 or higher
- A Supabase account (free tier works) → https://supabase.com
- An OpenAI API key → https://platform.openai.com/api-keys

### Step 1: Setup Supabase Database

1. Go to https://supabase.com and create a new project (free)
2. Once the project is ready, go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `backend/supabase-schema.sql` and paste it
5. Click **Run** to execute
6. Go to **Settings** → **API** and copy:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Service Role Key** (the secret one, NOT the anon key)

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-actual-service-role-key
OPENAI_API_KEY=sk-your-actual-openai-api-key
PORT=3001
```

Start the backend server:

```bash
npm start
```

You should see:
```
╔══════════════════════════════════════════════╗
║         HabitFlow Backend Server             ║
║  Server running on port 3001                 ║
╚══════════════════════════════════════════════╝
```

### Step 3: Setup Frontend

Open a **new terminal** (keep the backend running):

```bash
# Go back to the root folder
cd ..

# Install frontend dependencies
npm install

# Start the dev server
npm run dev
```

Open your browser and go to: **http://localhost:3000**

### Step 4: Use the App

1. Click **Sign In** (demo mode works without backend)
2. Explore the Dashboard, Habits, Statistics, and AI Assistant
3. The AI Assistant uses RAG when the backend is connected

---

## 🤖 How RAG Works

**RAG = Retrieval Augmented Generation**

When you ask the AI assistant a question:

```
1. RETRIEVE → Backend fetches YOUR habit data from Supabase
                (your habits, completion logs, streaks, stats)

2. AUGMENT  → Your data is added to the AI prompt as context
                (so the AI "knows" your specific situation)

3. GENERATE → OpenAI generates a response using YOUR data
                (personalized advice, not generic tips)
```

**Example:**
- Without RAG: "Try to be more consistent with your habits!"
- With RAG: "Your Meditation habit has a 24-day streak! Your data shows 92% completion before 9 AM. Try moving Exercise to the morning."

---

## 🔌 API Endpoints

The backend provides these REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/habits?user_id=...` | Get user's habits |
| POST | `/api/habits` | Create a habit |
| PUT | `/api/habits/:id` | Update a habit |
| DELETE | `/api/habits/:id` | Delete a habit |
| GET | `/api/habit-logs?user_id=...` | Get habit logs |
| POST | `/api/habit-logs` | Log a completion |
| POST | `/api/ai/chat` | AI chat (uses RAG) |
| GET | `/api/stats?user_id=...` | Get user statistics |

---

## 🗄️ Database Tables

### habits
Stores user habits (name, category, icon, color, frequency, active days)

### habit_logs
Records when a habit is completed (date, notes)

### ai_conversations
Stores AI chat history for each user

---

## 📝 Key Points

1. **Frontend works standalone** - Demo mode works without the backend
2. **Backend is pure Node.js** - No Express, no frameworks, just the built-in `http` module
3. **No TypeScript** - Plain JavaScript throughout
4. **Pure CSS** - No Tailwind, no CSS frameworks
5. **Simple SQL** - Basic PostgreSQL through Supabase, no complex queries
6. **RAG implementation** - Real AI personalization using your data

---

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Service Role Key used only on backend (never exposed to frontend)
- CORS configured for cross-origin requests
- All inputs validated

---

*Built with React + Node.js + Supabase + OpenAI RAG*
