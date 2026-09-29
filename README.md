# HabitFlow - Smart Habit Tracker with AI

A full-stack habit tracking application with AI-powered insights using RAG (Retrieval Augmented Generation).

## Tech Stack

- **Frontend:** React + Pure CSS
- **Backend:** Node.js (pure HTTP, no frameworks)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** OpenAI API with RAG

## Project Structure

```
HabitFlow/
├── src/                          # Frontend (React)
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   ├── styles.css                # All styles
│   ├── lib/
│   │   └── supabase.js           # Supabase client
│   └── components/
│       ├── LoginPage.jsx         # Auth (login/signup)
│       ├── Dashboard.jsx         # Main dashboard
│       ├── HabitList.jsx         # Habit management
│       ├── Statistics.jsx        # Analytics
│       └── AIAssistant.jsx       # AI chat with RAG
│
├── backend/                      # Backend (Node.js)
│   ├── server.js                 # HTTP server
│   ├── rag.js                    # RAG implementation
│   ├── package.json
│   ├── .env.example
│   └── supabase-schema.sql       # Database schema
│
├── .env                          # Frontend env variables
├── index.html
├── package.json
└── vite.config.js
```

## Setup Instructions

### Step 1: Setup Supabase Database

1. Go to https://supabase.com and create a new project (free)
2. Wait for the project to be ready
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `backend/supabase-schema.sql` and paste it
6. Click **Run** to execute

This creates:
- `profiles` table (user profiles)
- `habits` table (user habits)
- `habit_logs` table (completion records)
- `ai_conversations` table (AI chat history)
- Row Level Security policies
- Auto-create profile on signup trigger

### Step 2: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (the secret one, NOT the anon key)

### Step 3: Setup Frontend

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_API_URL=http://localhost:3001
```

**Important:** Use `VITE_` prefix (not `NEXT_PUBLIC_`) because this is a Vite project, not Next.js.

Install dependencies and start:

```bash
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

### Step 4: Setup Backend

Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
```

**Note:** The backend uses the `service_role` key (not the anon key) because it needs to bypass Row Level Security.

Install dependencies and start:

```bash
cd backend
npm install
npm start
```

Backend runs on: **http://localhost:3001**

### Step 5: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `backend/.env` as `OPENAI_API_KEY`

## How to Use

1. Open http://localhost:3000
2. Click **Sign Up** to create an account
3. Verify your email (check your inbox)
4. Sign in with your credentials
5. Create your first habit
6. Track completions daily
7. View statistics
8. Chat with AI assistant for personalized advice

## How RAG Works

**RAG = Retrieval Augmented Generation**

When you ask the AI assistant a question:

1. **RETRIEVE** → Backend fetches YOUR habit data from Supabase
   - Your habits, completion logs, streaks, statistics

2. **AUGMENT** → Your data is added to the AI prompt as context
   - The AI now "knows" your specific situation

3. **GENERATE** → OpenAI generates a response using YOUR data
   - Personalized advice, not generic tips

**Example:**
- Without RAG: "Try to be more consistent!"
- With RAG: "Your Meditation habit has a 24-day streak! Your data shows 92% completion before 9 AM. Try moving Exercise to the morning."

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/habits?user_id=...` | Get user's habits |
| POST | `/api/habits` | Create a habit |
| PUT | `/api/habits/:id` | Update a habit |
| DELETE | `/api/habits/:id` | Delete a habit |
| GET | `/api/habit-logs?user_id=...` | Get habit logs |
| POST | `/api/habit-logs` | Log a completion |
| DELETE | `/api/habit-logs?habit_id=...&date=...` | Remove a completion |
| POST | `/api/ai/chat` | AI chat (uses RAG) |
| GET | `/api/stats?user_id=...` | Get user statistics |

## Database Schema

### profiles
- `id` (UUID) - References auth.users
- `email` (TEXT)
- `full_name` (TEXT)
- `created_at` (TIMESTAMP)

### habits
- `id` (UUID)
- `user_id` (UUID) - References auth.users
- `name` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `frequency` (TEXT) - daily/weekly/custom
- `target_days` (INTEGER[]) - Days of week
- `color` (TEXT) - Hex color
- `icon` (TEXT) - Emoji
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

### habit_logs
- `id` (UUID)
- `habit_id` (UUID) - References habits
- `user_id` (UUID) - References auth.users
- `completed_date` (DATE)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

### ai_conversations
- `id` (UUID)
- `user_id` (UUID) - References auth.users
- `messages` (JSONB)
- `response` (TEXT)
- `created_at` (TIMESTAMP)

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Service Role Key used only on backend (never exposed to frontend)
- Supabase Auth handles authentication
- CORS configured for cross-origin requests

## Troubleshooting

**Frontend not connecting to backend?**
- Make sure backend is running on port 3001
- Check `VITE_API_URL` in `.env`

**Can't sign up?**
- Check email verification is enabled in Supabase
- Go to Authentication → Providers → Email
- Make sure "Enable Email Provider" is ON

**AI chat not working?**
- Check backend is running
- Verify `OPENAI_API_KEY` in `backend/.env`
- Check backend console for errors

**Database errors?**
- Make sure you ran the SQL schema in Supabase
- Check Supabase dashboard for table creation

## Notes

- Frontend works standalone (demo mode) but needs backend for real data
- Backend requires Supabase + OpenAI API keys
- All data is stored in Supabase PostgreSQL database
- AI responses are personalized using RAG with your actual habit data
