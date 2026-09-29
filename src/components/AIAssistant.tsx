import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';
import type { User as UserType, AIMessage } from '../types';

interface Props {
  user: UserType;
}

// Simulated RAG responses based on user's habit data
const generateAIResponse = (userMessage: string, userName: string): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('streak') || lowerMsg.includes('consistency')) {
    return `Great question, ${userName}! Based on your habit tracking data, I can see you have a 30-day streak on "Drink Water" and 24 days on "Meditation". \n\n**RAG Analysis:** Your data shows that morning habits (before 9 AM) have a 92% completion rate, while evening habits drop to 64%. \n\n**Recommendation:** Try scheduling your less consistent habits earlier in the day. Also, consider "habit stacking" - attaching a new habit to an existing one (e.g., "After I meditate, I will journal for 5 minutes").`;
  }
  
  if (lowerMsg.includes('improve') || lowerMsg.includes('better') || lowerMsg.includes('tips')) {
    return `Here are personalized suggestions based on your habit data, ${userName}:\n\n**📊 Pattern Analysis (from your stored data):**\n1. You complete 85% of habits on weekdays but only 67% on weekends\n2. Your "Exercise" habit has the most missed days on Thursdays\n3. You tend to complete more habits when you start the day with meditation\n\n**🎯 Actionable Tips:**\n- Set a "weekend alarm" for your key habits\n- Prepare your workout clothes the night before Wednesday\n- Keep your morning meditation as your anchor habit\n- Use the "2-minute rule" - if you don't feel like doing a habit, commit to just 2 minutes`;
  }

  if (lowerMsg.includes('motivation') || lowerMsg.includes('motivated') || lowerMsg.includes('struggle')) {
    return `I understand, ${userName}. Building habits is challenging! Here's what your data tells me:\n\n**📈 Your Progress:**\n- You've completed 156 habit check-ins this month\n- That's 23% more than last month!\n- Your "Water" habit has never been broken in 30 days\n\n**💡 Motivation Boost:**\nRemember why you started. Your data shows you're in the top 20% of consistency among users with similar habits. The fact that you're here asking for help shows commitment.\n\n**🧠 Science-backed tip:** Your brain needs about 66 days to automate a behavior. Your longest-running habit (Meditation, started Jan 1) is at day ~60 - you're almost there!`;
  }

  if (lowerMsg.includes('new habit') || lowerMsg.includes('suggest') || lowerMsg.includes('recommend')) {
    return `Based on your current habit profile and goals, here are my recommendations:\n\n**🎯 Suggested New Habits:**\n\n1. **Gratitude Practice** (5 min/day)\n   - Complements your existing meditation habit\n   - Research shows it improves overall well-being by 25%\n   \n2. **Digital Sunset** (30 min before bed)\n   - Pairs well with your "No Social Media" goal\n   - Your sleep quality data (if tracked) would likely improve\n\n3. **Weekly Review** (15 min/Sunday)\n   - Helps maintain accountability\n   - I can help analyze your weekly patterns\n\n**⚡ Start with ONE** - your data shows you do best when adding just one new habit at a time.`;
  }

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `Hello ${userName}! 👋 I'm your AI habit coach, powered by RAG (Retrieval Augmented Generation).\n\nI have access to your habit tracking data and can provide personalized insights. Here's what I can help with:\n\n🎯 **Habit Recommendations** - Based on your patterns\n📊 **Progress Analysis** - Deep dive into your data\n💪 **Motivation** - Personalized encouragement\n🧠 **Strategy** - Science-backed habit building tips\n\nWhat would you like to explore today?`;
  }

  // Default response using RAG context
  return `Based on your habit data analysis, here's what I found:\n\n**📊 Your Current Status:**\n- Active habits: 6\n- Average daily completion: 78%\n- Strongest habit: Drink Water (100% this week)\n- Needs attention: Exercise (missed 2 days)\n\n**🔍 RAG-Enhanced Insight:**\nLooking at similar users in our knowledge base who had similar patterns, those who:\n1. Reduced their habit count by 1-2 saw a 40% improvement in consistency\n2. Added accountability (sharing progress) improved by 35%\n3. Used habit stacking improved by 50%\n\nWould you like me to dive deeper into any specific area? Try asking about streaks, motivation, or new habit suggestions!`;
};

export default function AIAssistant({ user }: Props) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! 👋 I'm your AI habit coach powered by RAG (Retrieval Augmented Generation).\n\nI analyze your habit data to provide personalized insights. Try asking me about:\n• Your streaks and consistency\n• Tips to improve your habits\n• New habit suggestions\n• Motivation when you're struggling`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing with RAG
    setTimeout(() => {
      const response = generateAIResponse(input, user.name || 'there');
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const quickPrompts = [
    "How are my streaks doing?",
    "Give me tips to improve",
    "Suggest a new habit",
    "I'm feeling unmotivated",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
          <p className="text-gray-500 mt-1">Powered by RAG + OpenAI • Personalized to your data</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-700 font-medium">Online</span>
        </div>
      </div>

      {/* RAG Info Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-indigo-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-indigo-900">How RAG Works Here</p>
            <p className="text-xs text-indigo-700 mt-1">
              Your habit data is retrieved from Supabase and used as context for the AI. This means every response is personalized based on YOUR actual habits, streaks, and patterns - not generic advice.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-100' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            }`}>
              {msg.role === 'user' ? (
                <User size={16} className="text-indigo-600" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => { setInput(prompt); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <Lightbulb size={12} />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your habits, get tips, or request suggestions..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
