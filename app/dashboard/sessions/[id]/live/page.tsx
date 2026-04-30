"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare,
  Phone, Users, FileText, Subtitles, ChevronRight, Send,
  Bot, Clock, X, CheckCircle
} from "lucide-react";

const mockSession = {
  id: "1",
  topic: "Python Basics: Variables & Functions",
  session_type: "1-on-1",
  duration_minutes: 60,
  teacher: { name: "Arjun Sharma", avatar: "AS", college: "RVCE Bangalore" },
  learner: { name: "Priya Nair", avatar: "PN", college: "MSRIT Bangalore" },
};

const mockMessages = [
  { id: 1, sender: "Arjun Sharma", avatar: "AS", text: "Hey! Ready to dive into Python variables?", time: "3:50 PM", isMe: false },
  { id: 2, sender: "You", avatar: "PN", text: "Yes! I've been confused about mutable vs immutable types.", time: "3:51 PM", isMe: true },
  { id: 3, sender: "Arjun Sharma", avatar: "AS", text: "Great question! Let's start with that. In Python, integers and strings are immutable, while lists and dicts are mutable.", time: "3:52 PM", isMe: false },
];

const mockCaptions = [
  "...so when we talk about variable scope in Python...",
  "...local variables are only accessible within the function...",
  "...global variables can be accessed anywhere in the module...",
];

const mockNotes = [
  "Python variables: case-sensitive, no declaration needed",
  "Mutable: list, dict, set | Immutable: int, str, tuple",
  "Variable scope: local vs global vs nonlocal",
  "Best practice: use descriptive names (snake_case)",
];

export default function LiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [elapsed, setElapsed] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [captionIdx, setCaptionIdx] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cycle captions
  useEffect(() => {
    if (!captionsOn) return;
    const interval = setInterval(() => setCaptionIdx(i => (i + 1) % mockCaptions.length), 4000);
    return () => clearInterval(interval);
  }, [captionsOn]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: "You",
      avatar: "PN",
      text: message,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }]);
    setMessage("");
  };

  const handleEndSession = async () => {
    setEndingSession(true);
    try {
      await fetch("/api/sessions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: params?.id || null,
          creditCost: mockSession.session_type === "1-on-1" ? 1 : 0.5,
        }),
      });
    } catch (e) {
      // Still show completion even if network fails
    }
    setShowEndDialog(false);
    setEndingSession(false);
    setSessionEnded(true);
    // Prefetch sessions page so it reloads fresh data when navigating back
    router.prefetch("/dashboard/sessions");
  };

  if (sessionEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0F1F35" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-[#38A169]/20 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-[#38A169]" />
          </div>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>
            Session Complete!
          </h1>
          <p className="text-[#A0AEC0] mb-2">Great session on <span className="text-[#EDF2F7] font-medium">{mockSession.topic}</span></p>
          <div className="glass-card rounded-2xl p-5 mb-6 mt-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#A0AEC0]">Duration</span>
              <span className="text-[#EDF2F7] font-mono">{formatTime(elapsed)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A0AEC0]">Credits Transferred</span>
              <span className="text-[#38A169] font-bold font-mono">-1 credit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A0AEC0]">AI Summary</span>
              <span className="text-[#63B3ED]">Generating...</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/sessions/review"
              className="w-full py-3 bg-[#D69E2E] hover:bg-[#B7791F] text-white rounded-xl font-medium transition-colors text-center"
            >
              ⭐ Rate Your Session
            </Link>
            <Link
              href="/dashboard/sessions/feedback"
              className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl font-medium transition-colors text-center"
            >
              View AI Feedback
            </Link>
            <button
              onClick={() => { router.push("/dashboard/sessions"); router.refresh(); }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-[#A0AEC0] rounded-xl font-medium transition-colors text-center"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#0F1F35" }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2B6CB0] flex items-center justify-center text-white font-bold text-sm">JS</div>
          <div>
            <p className="text-[#EDF2F7] text-sm font-semibold leading-tight">{mockSession.topic}</p>
            <p className="text-[#A0AEC0] text-xs">{mockSession.session_type} · {mockSession.duration_minutes} min</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Live Note-taker indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#38A169]/20 border border-[#38A169]/30">
            <div className="w-2 h-2 rounded-full bg-[#38A169] animate-pulse" />
            <span className="text-[#38A169] text-xs font-medium">AI Note-taker</span>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5">
            <Clock className="w-3.5 h-3.5 text-[#A0AEC0]" />
            <span className="text-[#EDF2F7] text-sm font-mono">{formatTime(elapsed)}</span>
          </div>
          {/* Participants */}
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#A0AEC0]" />
            <span className="text-[#A0AEC0] text-sm">2</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* Teacher video */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a3a5c] to-[#0F1F35] border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#2B6CB0] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {mockSession.teacher.avatar}
                </div>
                <p className="text-[#EDF2F7] font-medium">{mockSession.teacher.name}</p>
                <p className="text-[#A0AEC0] text-xs mt-1">{mockSession.teacher.college}</p>
                <div className="flex items-center gap-1 justify-center mt-2">
                  <div className="w-2 h-2 rounded-full bg-[#38A169]" />
                  <span className="text-[#38A169] text-xs">Teaching</span>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <div className="p-1.5 rounded-lg bg-black/50">
                  <Mic className="w-3 h-3 text-[#38A169]" />
                </div>
                <div className="p-1.5 rounded-lg bg-black/50">
                  <Video className="w-3 h-3 text-[#38A169]" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-[#A0AEC0] bg-black/50 px-2 py-1 rounded-lg">
                {mockSession.teacher.name}
              </div>
            </div>

            {/* Learner (you) video */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2f4a] to-[#0a1929] border border-white/10 flex items-center justify-center">
              {camOn ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#38A169] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {mockSession.learner.avatar}
                  </div>
                  <p className="text-[#EDF2F7] font-medium">{mockSession.learner.name}</p>
                  <p className="text-[#A0AEC0] text-xs mt-1">{mockSession.learner.college}</p>
                  <div className="flex items-center gap-1 justify-center mt-2">
                    <div className="w-2 h-2 rounded-full bg-[#63B3ED]" />
                    <span className="text-[#63B3ED] text-xs">Learning</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    <VideoOff className="w-8 h-8 text-[#A0AEC0]" />
                  </div>
                  <p className="text-[#A0AEC0] text-sm">Camera Off</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <div className={`p-1.5 rounded-lg ${micOn ? 'bg-black/50' : 'bg-[#E53E3E]/80'}`}>
                  {micOn ? <Mic className="w-3 h-3 text-[#38A169]" /> : <MicOff className="w-3 h-3 text-white" />}
                </div>
                <div className={`p-1.5 rounded-lg ${camOn ? 'bg-black/50' : 'bg-[#E53E3E]/80'}`}>
                  {camOn ? <Video className="w-3 h-3 text-[#38A169]" /> : <VideoOff className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-[#A0AEC0] bg-black/50 px-2 py-1 rounded-lg">
                You (Learner)
              </div>
            </div>
          </div>

          {/* AI Captions */}
          {captionsOn && (
            <div className="glass-card rounded-xl px-4 py-3 border border-[#2B6CB0]/30">
              <div className="flex items-center gap-2 mb-1">
                <Subtitles className="w-3.5 h-3.5 text-[#63B3ED]" />
                <span className="text-[#63B3ED] text-xs font-medium">AI Live Captions</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#63B3ED] animate-pulse ml-auto" />
              </div>
              <p className="text-[#EDF2F7] text-sm italic">&ldquo;{mockCaptions[captionIdx]}&rdquo;</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 py-2 shrink-0">
            <button
              onClick={() => setMicOn(v => !v)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${micOn ? 'bg-white/10 hover:bg-white/20 text-[#EDF2F7]' : 'bg-[#E53E3E] text-white'}`}
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setCamOn(v => !v)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${camOn ? 'bg-white/10 hover:bg-white/20 text-[#EDF2F7]' : 'bg-[#E53E3E] text-white'}`}
              title={camOn ? "Turn off camera" : "Turn on camera"}
            >
              {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setScreenShare(v => !v)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${screenShare ? 'bg-[#38A169] text-white' : 'bg-white/10 hover:bg-white/20 text-[#EDF2F7]'}`}
              title="Share screen"
            >
              <MonitorUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCaptionsOn(v => !v)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${captionsOn ? 'bg-[#2B6CB0] text-white' : 'bg-white/10 hover:bg-white/20 text-[#EDF2F7]'}`}
              title="Toggle captions"
            >
              <Subtitles className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setChatOpen(true); setNotesOpen(false); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${chatOpen ? 'bg-[#2B6CB0] text-white' : 'bg-white/10 hover:bg-white/20 text-[#EDF2F7]'}`}
              title="Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setNotesOpen(true); setChatOpen(false); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${notesOpen ? 'bg-[#D69E2E] text-white' : 'bg-white/10 hover:bg-white/20 text-[#EDF2F7]'}`}
              title="AI Notes"
            >
              <FileText className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-white/20 mx-1" />
            <button
              onClick={() => setShowEndDialog(true)}
              className="px-4 h-12 rounded-xl bg-[#E53E3E] hover:bg-[#C53030] text-white flex items-center gap-2 font-medium transition-colors"
            >
              <Phone className="w-4 h-4 rotate-[135deg]" />
              End
            </button>
          </div>
        </div>

        {/* Side Panel */}
        {(chatOpen || notesOpen) && (
          <div className="w-80 border-l border-white/10 flex flex-col overflow-hidden shrink-0">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex gap-1">
                <button
                  onClick={() => { setChatOpen(true); setNotesOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${chatOpen ? 'bg-[#2B6CB0] text-white' : 'text-[#A0AEC0] hover:text-[#EDF2F7]'}`}
                >
                  Chat
                </button>
                <button
                  onClick={() => { setNotesOpen(true); setChatOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${notesOpen ? 'bg-[#D69E2E] text-white' : 'text-[#A0AEC0] hover:text-[#EDF2F7]'}`}
                >
                  AI Notes
                </button>
              </div>
              <button onClick={() => { setChatOpen(false); setNotesOpen(false); }} className="text-[#A0AEC0] hover:text-[#EDF2F7]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat panel */}
            {chatOpen && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isMe ? 'bg-[#38A169]' : 'bg-[#2B6CB0]'} text-white`}>
                        {msg.avatar}
                      </div>
                      <div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`px-3 py-2 rounded-xl text-sm ${msg.isMe ? 'bg-[#2B6CB0] text-white rounded-tr-sm' : 'bg-white/10 text-[#EDF2F7] rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[#A0AEC0] text-xs mt-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]"
                    />
                    <button
                      onClick={sendMessage}
                      className="w-9 h-9 rounded-xl bg-[#2B6CB0] hover:bg-[#2C5282] text-white flex items-center justify-center transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Notes panel */}
            {notesOpen && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-4 h-4 text-[#D69E2E]" />
                  <span className="text-[#D69E2E] text-sm font-medium">AI Note-taker</span>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38A169] animate-pulse" />
                    <span className="text-[#38A169] text-xs">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockNotes.map((note, i) => (
                    <div key={i} className="flex gap-2 glass-card rounded-xl p-3">
                      <ChevronRight className="w-4 h-4 text-[#D69E2E] shrink-0 mt-0.5" />
                      <p className="text-[#EDF2F7] text-sm">{note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl border border-dashed border-white/20 text-center">
                  <p className="text-[#A0AEC0] text-xs">Notes are auto-generated and will be available after the session ends</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* End Session Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full mx-4 border border-white/20">
            <h3 className="text-xl font-bold text-[#EDF2F7] mb-2" style={{ fontFamily: "Fraunces, serif" }}>End Session?</h3>
            <p className="text-[#A0AEC0] text-sm mb-6">
              Both parties must confirm to complete the session and transfer credits. Are you ready to end?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndDialog(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDF2F7] font-medium transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleEndSession}
                disabled={endingSession}
                className="flex-1 py-2.5 rounded-xl bg-[#E53E3E] hover:bg-[#C53030] text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {endingSession ? "Ending..." : "End Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
