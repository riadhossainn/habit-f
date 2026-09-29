import { useState, useRef, useEffect } from 'react';
import { API_URL } from '../lib/supabase.js';

export default function AIAssistant({ user }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI habit coach powered by RAG (Retrieval Augmented Generation).\n\nI analyze your habit data to provide personalized insights. Try asking me about:\n• Your streaks and consistency\n• Tips to improve your habits\n• New habit suggestions\n• Motivation when you're struggling`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
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

    try {
      const conversationHistory = [...messages, userMsg];
      
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          user_id: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running and try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
