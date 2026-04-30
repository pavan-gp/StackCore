"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, ChevronDown } from "lucide-react";

const suggestions = [
  "How do I earn credits?",
  "How does matching work?",
  "How to book a session?",
  "What skills are popular?",
];

const botResponses: Record<string, string> = {
  "How do I earn credits?": "Great question! You can earn credits in several ways:\n\n⚡ +2 credits on email verification (signup bonus)\n📚 +1 credit for each session you teach\n⭐ +0.5 bonus for a 5-star rating\n🏆 +2 bonus after completing 5 sessions\n\nYou can also earn credits by completing your profile (bio, photo, skills)!",
  "How does matching work?": "Our AI matching engine analyzes:\n\n🎯 Skills you offer vs. what others want\n📅 Your availability windows\n⭐ Past session ratings\n🤝 Learning compatibility scores\n\nThe result is a Match Score % shown on each profile card. Higher % = better skill swap potential!",
  "How to book a session?": "Booking is easy! Here's how:\n\n1️⃣ Go to the Match page and find your partner\n2️⃣ Click 'Request Session'\n3️⃣ Pick a time slot on the calendar\n4️⃣ Choose 1-on-1 (-1 credit) or Group (-0.5 credits)\n5️⃣ Both parties confirm → Session booked!\n\nYou'll get a reminder notification before the session.",
  "What skills are popular?": "🔥 Trending skills right now:\n\n💻 Programming: Python, JavaScript, React\n🎨 Design: Figma, UI/UX, Web Design\n🎵 Music: Guitar, Piano\n📊 Academics: Data Science, ML\n🗣️ Languages: English, Hindi, Kannada\n\nVisit the Explore page to see all 150+ available skills!",
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: "👋 Hi! I'm Jnana — your AI learning assistant. How can I help you today?\n\nI can help with credits, matching, sessions, and more!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = botResponses[text] || 
        "Thanks for asking! For detailed help, please try:\n\n• 'How do I earn credits?'\n• 'How does matching work?'\n• 'How to book a session?'\n• 'What skills are popular?'\n\nOr explore the platform directly! 🚀";
      
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#2B6CB0] hover:bg-[#2C5282] flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 animate-pulse-glow"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5 text-white" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden" style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10" style={{ background: "linear-gradient(135deg, #1E3A5F, #2B6CB0)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Jnana AI Assistant</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#38A169] animate-pulse" />
                <span className="text-xs text-blue-200">Online · Responds instantly</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto text-white/60 hover:text-white">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#2B6CB0] text-white rounded-br-sm'
                    : 'bg-white/10 text-[#EDF2F7] rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A0AEC0] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A0AEC0] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A0AEC0] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 border-t border-white/5">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="shrink-0 px-2.5 py-1 text-xs rounded-full bg-[#2B6CB0]/20 border border-[#2B6CB0]/30 text-[#63B3ED] hover:bg-[#2B6CB0]/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 text-xs bg-white/6 border border-white/10 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-8 h-8 rounded-xl bg-[#2B6CB0] flex items-center justify-center hover:bg-[#2C5282] transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
