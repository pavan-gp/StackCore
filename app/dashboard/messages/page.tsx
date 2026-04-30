"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { useState } from "react";
import { Send, Search, MessageSquare, ArrowLeft } from "lucide-react";

const mockConversations = [
  { id: 1, name: "Arjun Kumar", lastMsg: "Thanks for the Python session!", time: "2m ago", unread: 2, online: true },
  { id: 2, name: "Priya Sharma", lastMsg: "Can we reschedule to tomorrow?", time: "1h ago", unread: 0, online: false },
  { id: 3, name: "Rahul Nair", lastMsg: "I've been practicing the chord you showed me", time: "3h ago", unread: 1, online: true },
  { id: 4, name: "Sneha Iyer", lastMsg: "Would you be interested in a session?", time: "1d ago", unread: 0, online: false },
];

const mockMessages = [
  { id: 1, sender: "other", text: "Hey! I saw your profile and I think we'd be a great match", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Hi Arjun! Yeah, I've been looking for someone to learn Python from", time: "10:32 AM" },
  { id: 3, sender: "other", text: "I can teach you Python basics, and I really want to learn Guitar", time: "10:35 AM" },
  { id: 4, sender: "me", text: "That's perfect! I've been playing guitar for 3 years. Should we book a session?", time: "10:36 AM" },
  { id: 5, sender: "other", text: "Absolutely! How about this weekend?", time: "10:38 AM" },
];

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [message, setMessage] = useState("");
  const [showList, setShowList] = useState(true);

  const suggestions = ["Sure, let's schedule that!", "Would you like to book a session?", "Thanks for the session 🙏"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex gap-4 h-[calc(100vh-140px)]">
          {/* Conversations List */}
          <div className={`w-full md:w-80 glass-card rounded-2xl flex flex-col shrink-0 ${!showList && 'hidden md:flex'}`}>
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/6 border border-white/10 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => { setSelectedConv(conv); setShowList(false); }}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${selectedConv.id === conv.id ? 'bg-white/8' : ''}`}
                  style={{ background: selectedConv.id === conv.id ? "rgba(255,255,255,0.08)" : undefined }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {conv.name[0]}
                    </div>
                    {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#38A169] border-2 border-[#0F1F35]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#EDF2F7] text-sm">{conv.name}</span>
                      <span className="text-xs text-[#A0AEC0]">{conv.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-xs text-[#A0AEC0] truncate">{conv.lastMsg}</span>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#2B6CB0] text-white text-xs flex items-center justify-center shrink-0 ml-2">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 glass-card rounded-2xl flex flex-col ${showList && 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <button onClick={() => setShowList(true)} className="md:hidden text-[#A0AEC0] hover:text-[#EDF2F7]">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-semibold">
                  {selectedConv.name[0]}
                </div>
                {selectedConv.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#38A169] border-2 border-[#0F1F35]" />}
              </div>
              <div>
                <div className="font-semibold text-[#EDF2F7]">{selectedConv.name}</div>
                <div className="text-xs text-[#A0AEC0]">{selectedConv.online ? "Online" : "Offline"}</div>
              </div>
              <div className="ml-auto">
                <button className="px-3 py-1.5 bg-[#2B6CB0]/20 hover:bg-[#2B6CB0]/30 border border-[#2B6CB0]/30 rounded-lg text-[#63B3ED] text-xs font-medium transition-colors">
                  Book Session
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === 'me'
                        ? 'bg-[#2B6CB0] text-white rounded-br-sm'
                        : 'bg-white/10 text-[#EDF2F7] rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-[#A0AEC0]">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            <div className="px-4 py-2 border-t border-white/5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(s)}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-full bg-[#2B6CB0]/20 border border-[#2B6CB0]/30 text-[#63B3ED] hover:bg-[#2B6CB0]/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 text-sm bg-white/6 border border-white/10 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  onKeyDown={e => e.key === 'Enter' && setMessage("")}
                />
                <button
                  onClick={() => setMessage("")}
                  className="w-10 h-10 rounded-xl bg-[#2B6CB0] hover:bg-[#2C5282] flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
