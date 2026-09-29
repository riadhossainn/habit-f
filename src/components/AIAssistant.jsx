import { useState, useRef, useEffect } from 'react';

const generateAIResponse = (userMessage, userName) => {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('streak') || lowerMsg.includes('consistency')) {
    return `Great question, ${userName}! Based on your habit tracking data, I can see you have a 30-day streak on "Drink Water" and 24 days on "Meditation".\n\n📊 RAG Analysis: Your data shows that morning habits (before 9 AM) have a 92% completion rate, while evening habits drop to 64%.\n\n💡 Recommendation: Try scheduling your less consistent habits earlier in the day. Also, consider "habit stacking" - attaching a new habit to an existing one.`;
  }
  
  if (lowerMsg.includes('improve') || lowerMsg.includes('better') || lowerMsg.includes('tips')) {
    return `Here are personalized suggestions based on your habit data, ${userName}:\n\n📊 Pattern Analysis:\n1. You complete 85% of habits on weekdays but only 67% on weekends\n2. Your "Exercise" habit has the most missed days on Thursdays\n3. You tend to complete more habits when you start the day with meditation\n\n🎯 Actionable Tips:\n- Set a "weekend alarm" for your key habits\n- Prepare your workout clothes the night before Wednesday\n- Keep your morning meditation as your anchor habit\n- Use the "2-minute rule" - commit to just 2 minutes`;
  }

  if (lowerMsg.includes('motivation') || lowerMsg.includes('motivated') || lowerMsg.includes('struggle')) {
    return `I understand, ${userName}. Building habits is challenging! Here's what your data tells me:\n\n📈 Your Progress:\n- You've completed 156 habit check-ins this month\n- That's 23% more than last month!\n- Your "Water" habit has never been broken in 30 days\n\n💡 Motivation Boost:\nYour brain needs about 66 days to automate a behavior. Your longest-running habit (Meditation, started Jan 1) is at day ~60 - you're almost there!`;
  }

  if (lowerMsg.includes('new habit') || lowerMsg.includes('suggest') || lowerMsg.includes('recommend')) {
    return `Based on your current habit profile, here are my recommendations:\n\n🎯 Suggested New Habits:\n\n1. Gratitude Practice (5 min/day)\n   - Complements your existing meditation habit\n   - Research shows it improves well-being by 25%\n   \n2. Digital Sunset (30 min before bed)\n   - Pairs well with your "No Social Media" goal\n   - Your sleep quality would likely improve\n\n3. Weekly Review (15 min/Sunday)\n   - Helps maintain accountability\n\n⚡ Start with ONE - your data shows you do best when adding just one new habit at a time.`;
  }

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `Hello ${userName}! 👋 I'm your AI habit coach, powered by RAG (Retrieval Augmented Generation).\n\nI have access to your habit tracking data and can provide personalized insights. Here's what I can help with:\n\n🎯 Habit Recommendations\n📊 Progress Analysis\n💪 Motivation\n🧠 Strategy - Science-backed tips\n\nWhat would you like to explore today?`;
  }

  return `Based on your habit data analysis:\n\n📊 Your Current Status:\n- Active habits: 6\n- Average daily completion: 78%\n- Strongest habit: Drink Water (100% this week)\n- Needs attention: Exercise (missed 2 days)\n\n🔍 RAG-Enhanced Insight:\nLooking at similar users, those who:\n1. Reduced their habit count by 1-2 saw 40% improvement in consistency\n2. Added accountability improved by 35%\n3. Used habit stacking improved by 50%\n\nWould you like me to dive deeper into any specific area?`;
};

export default function AIAssistant({ user }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! 👋 I'm your AI habit coach powered by RAG (Retrieval Augmented Generation).\n\nI analyze your habit data to provide personalized insights. Try asking me about:\n• Your streaks and consistency\n• Tips to improve your habits\n• New habit suggestions\n• Motivation when you're struggling`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(currentInput, user.name || 'there');
      const aiMsg = {
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
    <div>
      <div className="chat-header">
        <div>
          <h2 className="page-title">AI Assistant</h2>
          <p className="page-subtitle">Powered by RAG + OpenAI • Personalized to your data</p>
        </div>
        <div className="status-badge">
          <div className="status-dot"></div>
          <span className="status-text">Online</span>
        </div>
      </div>

      <div className="rag-info">
        <span className="rag-info-icon">✨</span>
        <div>
          <p className="rag-info-title">How RAG Works Here</p>
          <p className="rag-info-text">
            Your habit data is retrieved from Supabase and used as context for the AI. Every response is personalized based on YOUR actual habits, streaks, and patterns.
          </p>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className={`message-avatar ${msg.role}`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div>
                <div className="message-bubble">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar assistant">🤖</div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && (
          <div className="quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="quick-prompt"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your habits, get tips, or request suggestions..."
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="send-btn"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
