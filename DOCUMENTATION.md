# HabitFlow - Smart Habit Tracker with AI

## Project Overview

**HabitFlow** is a full-stack habit tracking web application that helps users build and maintain healthy habits using AI-powered insights. The project uses **React** for the frontend, **Node.js** for the backend, **Supabase** (PostgreSQL) for the database, and implements **RAG (Retrieval Augmented Generation)** with the **OpenAI API** for personalized AI assistance.

---

## 📁 Project Structure

```
HabitFlow/
├── src/                          # React Frontend
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Tailwind CSS imports
│   ├── vite-env.d.ts            # Vite TypeScript declarations
│   ├── components/
│   │   ├── LoginPage.tsx         # Authentication page
│   │   ├── Dashboard.tsx         # Main dashboard with overview
│   │   ├── HabitList.tsx         # Habit management (CRUD)
│   │   ├── Statistics.tsx        # Charts and analytics
│   │   └── AIAssistant.tsx       # RAG-powered AI chat
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client configuration
│   │   └── api.ts                # API service functions
│   └── types/
│       └── index.ts              # TypeScript type definitions
│
├── backend/                      # Node.js Backend
│   ├── server.js                 # Main HTTP server (pure Node.js)
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── supabase-schema.sql       # Database schema for Supabase
│
├── index.html                    # HTML entry point
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite build configuration
├── tsconfig.json                 # TypeScript configuration
└── DOCUMENTATION.md              # This file
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations |
| **Recharts** | Charts & graphs |
| **Lucide React** | Icons |
| **date-fns** | Date utilities |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** (pure http module) | HTTP server - NO Express or other frameworks |
| **@supabase/supabase-js** | Database client |
| **OpenAI API** | AI text generation for RAG |

### Database & AI
| Technology | Purpose |
|-----------|---------|
| **Supabase** | PostgreSQL database + Auth |
| **PostgreSQL** | Relational database (simple SQL, no PL/SQL) |
| **OpenAI GPT-3.5-turbo** | AI model for RAG generation |

---

## 🏗️ Architecture

### Frontend-Backend Communication
```
┌─────────────────┐         HTTP/REST         ┌──────────────────┐
│   React App     │ ◄──────────────────────► │  Node.js Server  │
│   (Port 3000)   │    JSON over HTTP        │  (Port 3001)     │
└─────────────────┘                           └────────┬─────────┘
                                                       │
                                                       │ Supabase SDK
                                                       ▼
                                               ┌───────────────┐
                                               │   Supabase    │
                                               │  (PostgreSQL) │
                                               └───────────────┘
```

### RAG (Retrieval Augmented Generation) Flow
```
User Question
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Step 1: RETRIEVE                               │
│  Fetch user's habit data from Supabase          │
│  - Active habits                                │
│  - Completion logs (last 30 days)               │
│  - Calculated statistics (streaks, rates)       │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Step 2: AUGMENT                                │
│  Build context-rich system prompt               │
│  - Include user's specific data                 │
│  - Add conversation history                     │
│  - Format as structured context                 │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Step 3: GENERATE                               │
│  Send to OpenAI API                             │
│  - System prompt with user context              │
│  - User's question                              │
│  - Get personalized AI response                 │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
              Personalized AI Response
              (based on REAL user data)
```

---

## 🗄️ Database Schema (Supabase/PostgreSQL)

### Table: `habits`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Owner's user ID |
| name | TEXT | Habit name |
| description | TEXT | Brief description |
| category | TEXT | Category (Health, Fitness, etc.) |
| frequency | TEXT | daily/weekly/custom |
| target_days | INTEGER[] | Days of week (0=Sun, 6=Sat) |
| color | TEXT | Display color hex |
| icon | TEXT | Emoji icon |
| is_active | BOOLEAN | Whether habit is active |
| created_at | TIMESTAMP | Creation time |

### Table: `habit_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| habit_id | UUID | Reference to habits table |
| user_id | TEXT | Owner's user ID |
| completed_date | DATE | Date of completion |
| notes | TEXT | Optional notes |
| created_at | TIMESTAMP | Log creation time |

### Table: `ai_conversations`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Owner's user ID |
| messages | JSONB | Conversation history |
| response | TEXT | AI's response |
| created_at | TIMESTAMP | Conversation time |

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/habits?user_id=...` | Get all habits for user |
| POST | `/api/habits` | Create new habit |
| PUT | `/api/habits/:id` | Update a habit |
| DELETE | `/api/habits/:id` | Delete a habit |
| GET | `/api/habit-logs?user_id=...&start=...&end=...` | Get habit logs |
| POST | `/api/habit-logs` | Log habit completion |
| POST | `/api/ai/chat` | Send message to AI (RAG) |
| GET | `/api/stats?user_id=...` | Get user statistics |

---

## 🚀 How to Run

### Prerequisites
- Node.js >= 18
- A Supabase account (free tier works)
- An OpenAI API key

### 1. Setup Supabase Database
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the contents of `backend/supabase-schema.sql`
4. Copy your project URL and service role key

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your actual keys
npm start
```

### 3. Setup Frontend
```bash
# In the root directory
npm install
npm run dev
```

### 4. Environment Variables
Create a `.env` file in the backend directory:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-api-key
PORT=3001
```

---

## 🤖 RAG Implementation Details

### What is RAG?
RAG (Retrieval Augmented Generation) is a technique that enhances AI responses by first retrieving relevant data from a database, then using that data as context when generating an AI response. This makes the AI's answers personalized and accurate.

### How We Implemented RAG

1. **Retrieval Phase:**
   - When a user sends a message to the AI assistant
   - The backend queries Supabase for the user's habits, logs, and statistics
   - This data is fetched using simple SELECT queries (no complex SQL)

2. **Augmentation Phase:**
   - The retrieved data is formatted into a structured context string
   - This context is injected into the system prompt sent to OpenAI
   - The AI now "knows" the user's specific habits, streaks, and patterns

3. **Generation Phase:**
   - The augmented prompt (with user data) is sent to OpenAI's GPT-3.5-turbo
   - The AI generates a response that references the user's actual data
   - The response is saved to the database for history

### Example
**Without RAG:** "Try to be more consistent with your habits!"
**With RAG:** "I see your Meditation habit has a 24-day streak! Your data shows you complete 92% of morning habits but only 64% of evening ones. Try moving your Exercise habit to the morning."

---

## 📊 Frontend Features

### Dashboard
- Overview of all active habits
- Today's completion checklist
- Weekly progress visualization
- AI-powered insight cards
- Streak tracking

### Habit Management
- Create, edit, delete habits
- Set custom icons, colors, and categories
- Configure active days
- Search and filter habits

### Statistics
- Completion rate charts (bar chart)
- Monthly trend analysis (line chart)
- Category distribution (pie chart)
- Individual habit streaks
- Weekly and monthly views

### AI Assistant
- Chat interface with AI coach
- RAG-powered personalized responses
- Quick prompt suggestions
- Conversation history
- Real-time typing indicators

---

## 🔒 Security

- **Row Level Security (RLS):** Enabled on all Supabase tables
- **Service Role Key:** Backend uses service key (bypasses RLS for server operations)
- **CORS:** Configured for cross-origin requests
- **Input Validation:** All API inputs are validated
- **No SQL Injection:** Using Supabase SDK (parameterized queries)

---

## 📝 Key Design Decisions

1. **No Express.js:** Used pure Node.js `http` module to keep dependencies minimal
2. **No Complex SQL:** Simple PostgreSQL queries through Supabase SDK
3. **Supabase over raw PostgreSQL:** Provides auth, real-time, and easy setup
4. **OpenAI over Grok:** More reliable API with better documentation
5. **RAG over fine-tuning:** More cost-effective and easier to update
6. **TypeScript:** Type safety for the frontend
7. **Demo Mode:** Frontend works without backend for demonstration

---

## 🎓 For Explaining to Others

**In simple terms:**
> HabitFlow is a habit tracking app where users can create daily habits, track their completion, and view statistics. The special feature is the AI assistant that uses RAG - it reads the user's actual habit data from the database and gives personalized advice. Instead of generic tips, the AI says things like "Your meditation streak is 24 days, try scheduling exercise in the morning since your data shows 92% completion before 9 AM."

**Technical summary:**
> Full-stack app with React frontend, Node.js backend (pure HTTP, no frameworks), Supabase PostgreSQL database, and OpenAI-powered RAG system. The RAG pipeline retrieves user data → augments the AI prompt → generates personalized responses.

---

## 📦 Dependencies Summary

### Frontend (package.json)
- react, react-dom - UI framework
- @supabase/supabase-js - Database client
- framer-motion - Animations
- recharts - Charts
- lucide-react - Icons
- date-fns - Date utilities
- react-router-dom - Routing
- uuid - Unique IDs
- canvas-confetti - Celebrations
- tailwindcss - Styling
- vite - Build tool
- typescript - Type checking

### Backend (backend/package.json)
- @supabase/supabase-js - Database client
- Node.js built-in: http, https - Server and API calls

---

## ✅ Checklist for Submission

- [x] React frontend (no other frontend framework)
- [x] Node.js backend (no Express or other backend framework)
- [x] Supabase database (PostgreSQL, simple SQL)
- [x] RAG implementation with OpenAI API
- [x] Separate frontend and backend code
- [x] RESTful API design
- [x] TypeScript for type safety
- [x] Responsive UI design
- [x] Database schema with RLS
- [x] Environment configuration
- [x] Documentation

---

*Built with ❤️ using React + Node.js + Supabase + OpenAI RAG*
