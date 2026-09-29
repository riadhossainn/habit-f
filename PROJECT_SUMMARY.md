# HabitFlow - Project Summary for Professor

## What This Project Does

HabitFlow is a habit tracking web application where users can:
- Create and manage daily habits
- Track habit completions
- View statistics and streaks
- Chat with an AI assistant that provides personalized advice

## Technology Used

**Frontend:**
- React (plain JavaScript, no TypeScript)
- Pure CSS (no Tailwind or CSS frameworks)
- Vite (build tool)

**Backend:**
- Node.js (pure HTTP module, no Express or other frameworks)
- Supabase (PostgreSQL database)
- OpenAI API (for AI responses)

**Key Feature:**
- RAG (Retrieval Augmented Generation) - AI uses your actual habit data to give personalized advice

## How It Works

### User Flow
1. User signs up with email/password (Supabase Auth)
2. User creates habits (saved to Supabase database)
3. User marks habits complete each day (saved to database)
4. User views statistics (calculated from database)
5. User chats with AI assistant (uses RAG with their data)

### RAG Implementation
When user asks AI a question:
1. Backend retrieves user's habit data from Supabase
2. Data is added to the AI prompt as context
3. OpenAI generates personalized response using that data
4. Response is saved to database

**Example:**
- User asks: "How are my streaks?"
- Backend retrieves: User has 6 habits, longest streak is 30 days on "Drink Water"
- AI responds: "Your Drink Water habit has a 30-day streak! Great consistency."

## Database Structure

**4 tables in Supabase:**
1. `profiles` - User information
2. `habits` - User's habits (name, category, icon, etc.)
3. `habit_logs` - When habits are completed (date tracking)
4. `ai_conversations` - AI chat history

All tables have Row Level Security so users can only see their own data.

## Project Structure

```
Frontend (src/):
- App.jsx - Main app with navigation
- LoginPage.jsx - Login/signup with Supabase Auth
- Dashboard.jsx - Overview with today's habits
- HabitList.jsx - Create/edit/delete habits
- Statistics.jsx - Charts and streaks
- AIAssistant.jsx - Chat with AI

Backend (backend/):
- server.js - HTTP server (pure Node.js)
- rag.js - RAG implementation (separate file)
- supabase-schema.sql - Database schema
```

## How to Run

**1. Setup Supabase:**
- Create project at supabase.com
- Run the SQL schema from `backend/supabase-schema.sql`

**2. Setup Backend:**
```bash
cd backend
npm install
# Create .env with your Supabase + OpenAI keys
npm start
```

**3. Setup Frontend:**
```bash
npm install
npm run dev
```

**4. Open:** http://localhost:3000

## Key Points to Explain

1. **No frameworks on backend** - Used pure Node.js HTTP module (no Express)
2. **No TypeScript** - Plain JavaScript throughout
3. **Pure CSS** - No Tailwind or CSS frameworks
4. **Real authentication** - Supabase Auth with email/password
5. **Real database** - All data saved to Supabase PostgreSQL
6. **RAG implementation** - AI uses actual user data for personalized responses
7. **Separation of concerns** - Frontend and backend are separate, RAG logic is in its own file

## What Makes This Production-Ready

- Real user authentication (not demo mode)
- All data persisted to database
- Proper error handling
- Row Level Security on database
- Environment variables for secrets
- Clean code structure
- Comprehensive documentation

## Files to Show Professor

1. `backend/server.js` - Pure Node.js backend
2. `backend/rag.js` - RAG implementation
3. `backend/supabase-schema.sql` - Database schema
4. `src/App.jsx` - Main React component
5. `src/components/LoginPage.jsx` - Real authentication
6. `src/components/AIAssistant.jsx` - AI chat with RAG
7. `README.md` - Setup instructions
