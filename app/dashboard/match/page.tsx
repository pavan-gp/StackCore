"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Users, Star, Filter, Zap, ArrowRight, MessageSquare, X, Calendar, Clock, Coins, CheckCircle, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../../../supabase/client";
import { useRouter } from "next/navigation";

const allMatches = [
  { id: 1, name: "Arjun Kumar", college: "IIT Bangalore", teaches: ["Python", "Machine Learning"], wants: ["Guitar", "Music Theory"], match: 94, rating: 4.8, sessions: 12, bio: "CS grad student passionate about AI. Love jamming on weekends!", category: "Programming", availability: ["Mon 10am", "Wed 4pm", "Fri 6pm"] },
  { id: 2, name: "Priya Sharma", college: "BITS Pilani", teaches: ["Web Design", "Figma", "UI/UX"], wants: ["Data Science", "Python"], match: 89, rating: 4.9, sessions: 18, bio: "Designer by day, data enthusiast by night. Looking for Python help!", category: "Design", availability: ["Tue 11am", "Thu 3pm", "Sat 10am"] },
  { id: 3, name: "Rahul Nair", college: "NIT Trichy", teaches: ["Guitar", "Piano"], wants: ["Python", "Web Dev"], match: 92, rating: 4.7, sessions: 8, bio: "Music teacher turned tech learner. Can teach you any instrument!", category: "Music", availability: ["Mon 5pm", "Wed 7pm", "Sun 11am"] },
  { id: 4, name: "Sneha Iyer", college: "IIM Bangalore", teaches: ["Spanish", "Business Strategy"], wants: ["Python", "Data Analysis"], match: 76, rating: 4.6, sessions: 14, bio: "MBA student with 3 years marketing exp. Learning data skills now.", category: "Languages", availability: ["Tue 9am", "Thu 2pm", "Sat 4pm"] },
  { id: 5, name: "Karthik Rao", college: "PESIT Bangalore", teaches: ["Java", "Spring Boot"], wants: ["Guitar", "Photography"], match: 82, rating: 4.5, sessions: 6, bio: "Backend dev who wants to explore creative hobbies!", category: "Programming", availability: ["Mon 6pm", "Fri 5pm", "Sun 3pm"] },
  { id: 6, name: "Ananya Reddy", college: "RV College", teaches: ["Photography", "Video Editing"], wants: ["Python", "Graphic Design"], match: 78, rating: 4.8, sessions: 22, bio: "Visual storyteller who wants to add tech to my creative toolkit.", category: "Design", availability: ["Wed 10am", "Fri 3pm", "Sat 2pm"] },
  { id: 7, name: "Vikram Singh", college: "DTU Delhi", teaches: ["Tabla", "Hindustani Vocals"], wants: ["Machine Learning", "React"], match: 71, rating: 4.9, sessions: 31, bio: "Classical musician stepping into the world of code!", category: "Music", availability: ["Tue 4pm", "Thu 6pm", "Sun 10am"] },
  { id: 8, name: "Meera Nambiar", college: "NIT Calicut", teaches: ["Spanish", "French"], wants: ["UI/UX", "Figma"], match: 68, rating: 4.7, sessions: 9, bio: "Polyglot language tutor looking to pick up design skills.", category: "Languages", availability: ["Mon 3pm", "Wed 5pm", "Sat 11am"] },
  { id: 9, name: "Rohan Mehta", college: "VIT Vellore", teaches: ["React", "Node.js"], wants: ["Tabla", "Music Theory"], match: 85, rating: 4.6, sessions: 17, bio: "Full-stack dev by day, aspiring musician by night!", category: "Programming", availability: ["Tue 7pm", "Thu 8pm", "Fri 4pm"] },
];

const filterTags = ["All Skills", "Programming", "Music", "Design", "Languages", "5-Star Only"];

type Match = typeof allMatches[0];

export default function MatchPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Skills");
  const [selectedTrainer, setSelectedTrainer] = useState<Match | null>(null);
  const [bookingStep, setBookingStep] = useState<"profile" | "book" | "success">("profile");
  const [sessionType, setSessionType] = useState<"1-on-1" | "1-to-Many">("1-on-1");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [booking, setBooking] = useState(false);

  const creditCost = sessionType === "1-on-1" ? 1 : 0.5;

  const handleRequestSession = (trainer: Match) => {
    setSelectedTrainer(trainer);
    setBookingStep("profile");
    setSessionType("1-on-1");
    setSelectedSlot(null);
    setTopic("");
  };

  const handleConfirmBooking = async () => {
    if (!selectedTrainer || !selectedSlot) return;
    setBooking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/sign-in"); return; }

      const { data: userData } = await supabase.from("users").select("credit_balance").eq("user_id", user.id).single();
      const currentBalance = userData?.credit_balance ?? 0;

      if (currentBalance < creditCost) {
        alert("Insufficient credits! Teach a session first to earn credits.");
        setBooking(false);
        return;
      }

      const today = new Date();
      today.setDate(today.getDate() + (selectedTrainer.availability.indexOf(selectedSlot) + 1));

      const { data: session, error } = await supabase.from("sessions").insert({
        learner_id: user.id,
        teacher_id: user.id,
        session_type: sessionType,
        status: "confirmed",
        scheduled_at: today.toISOString(),
        duration_minutes: 60,
        topic: topic || `Learn ${selectedTrainer.teaches[0]} from ${selectedTrainer.name}`,
        agenda: `Session with ${selectedTrainer.name} from ${selectedTrainer.college}`,
        credit_cost: creditCost,
      }).select().single();

      if (error) throw error;

      await supabase.from("users").update({ credit_balance: currentBalance - creditCost }).eq("user_id", user.id);

      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -creditCost,
        type: "learn",
        description: `Session booked with ${selectedTrainer.name}: ${topic || selectedTrainer.teaches[0]}`,
        session_id: session?.id || null,
      });

      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "session",
        title: "Session Booked!",
        message: `Your ${sessionType} session with ${selectedTrainer.name} has been confirmed. ${creditCost} credit deducted.`,
        link: "/dashboard/sessions",
      });

      setBookingStep("success");
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    }
    setBooking(false);
  };

  const filtered = allMatches.filter(m => {
    if (activeFilter === "All Skills") return true;
    if (activeFilter === "5-Star Only") return m.rating >= 4.8;
    return m.category === activeFilter;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
              🤖 AI Skill Matching
            </h1>
            <p className="text-[#A0AEC0]">Ranked by compatibility score based on your skills and goals</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeFilter === tag
                  ? "bg-[#2B6CB0] text-white shadow-lg shadow-blue-900/30"
                  : "glass-card text-[#A0AEC0] hover:text-[#EDF2F7] hover:bg-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-[#A0AEC0] mb-6">
          Showing <span className="text-[#EDF2F7] font-medium">{filtered.length}</span> matches
          {activeFilter !== "All Skills" && <> in <span className="text-[#63B3ED]">{activeFilter}</span></>}
        </p>

        {/* Match Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#A0AEC0]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">No matches found for this filter.</p>
            <button onClick={() => setActiveFilter("All Skills")} className="mt-4 text-[#63B3ED] text-sm underline">
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((match, i) => (
              <div
                key={match.id}
                className="glass-card rounded-2xl p-5 hover:bg-white/10 transition-all duration-200 group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-bold text-lg">
                      {match.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-[#EDF2F7] text-sm">{match.name}</div>
                      <div className="text-xs text-[#A0AEC0]">{match.college}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#D69E2E]" />
                      <span className="text-sm font-bold text-[#D69E2E]">{match.match}%</span>
                    </div>
                    <div className="text-xs text-[#A0AEC0]">match</div>
                  </div>
                </div>

                <p className="text-xs text-[#A0AEC0] mb-4 leading-relaxed">{match.bio}</p>

                {/* Skills */}
                <div className="space-y-2 mb-4">
                  <div>
                    <div className="text-xs text-[#A0AEC0] mb-1">Teaches</div>
                    <div className="flex flex-wrap gap-1">
                      {match.teaches.map(skill => (
                        <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-[#38A169]/20 text-[#38A169] border border-[#38A169]/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#A0AEC0] mb-1">Wants to Learn</div>
                    <div className="flex flex-wrap gap-1">
                      {match.wants.map(skill => (
                        <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-[#2B6CB0]/20 text-[#63B3ED] border border-[#2B6CB0]/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-[#A0AEC0] mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#D69E2E] text-[#D69E2E]" />
                    <span>{match.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{match.sessions} sessions</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/dashboard/messages")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#EDF2F7] glass-card rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>
                  <button
                    onClick={() => handleRequestSession(match)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-[#2B6CB0] hover:bg-[#2C5282] rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Request Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Trainer Detail + Booking Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#0F1F35", border: "1px solid rgba(255,255,255,0.12)" }}>
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep === "profile" && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {selectedTrainer.name[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>{selectedTrainer.name}</h2>
                    <p className="text-sm text-[#A0AEC0]">{selectedTrainer.college}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#D69E2E] text-[#D69E2E]" />
                        <span className="text-sm text-[#D69E2E] font-medium">{selectedTrainer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#A0AEC0]">
                        <Users className="w-3 h-3" />
                        {selectedTrainer.sessions} sessions
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#D69E2E]" />
                        <span className="text-sm font-bold text-[#D69E2E]">{selectedTrainer.match}% match</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#A0AEC0] mb-5 leading-relaxed">{selectedTrainer.bio}</p>

                <div className="space-y-3 mb-5">
                  <div>
                    <div className="text-xs text-[#A0AEC0] mb-2 font-medium uppercase tracking-wide">Can Teach You</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTrainer.teaches.map(skill => (
                        <span key={skill} className="px-2.5 py-1 text-xs rounded-full bg-[#38A169]/20 text-[#38A169] border border-[#38A169]/30 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#A0AEC0] mb-2 font-medium uppercase tracking-wide">Wants to Learn</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTrainer.wants.map(skill => (
                        <span key={skill} className="px-2.5 py-1 text-xs rounded-full bg-[#2B6CB0]/20 text-[#63B3ED] border border-[#2B6CB0]/30 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#A0AEC0] mb-2 font-medium uppercase tracking-wide">Available Slots</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTrainer.availability.map(slot => (
                        <span key={slot} className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-[#A0AEC0] border border-white/10 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setBookingStep("book")}
                  className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Book a Session with {selectedTrainer.name.split(" ")[0]}
                </button>
              </>
            )}

            {bookingStep === "book" && (
              <>
                <button onClick={() => setBookingStep("profile")} className="flex items-center gap-1 text-[#A0AEC0] hover:text-[#EDF2F7] text-sm mb-4 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Back to profile
                </button>

                <h2 className="text-lg font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
                  Book with {selectedTrainer.name.split(" ")[0]}
                </h2>
                <p className="text-xs text-[#A0AEC0] mb-5">Choose your session details below</p>

                <div className="mb-4">
                  <label className="text-xs text-[#A0AEC0] font-medium uppercase tracking-wide block mb-2">Session Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["1-on-1", "1-to-Many"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setSessionType(type)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          sessionType === type
                            ? "bg-[#2B6CB0] border-[#2B6CB0] text-white"
                            : "bg-white/5 border-white/10 text-[#A0AEC0] hover:text-[#EDF2F7]"
                        }`}
                      >
                        {type === "1-on-1" ? "1-on-1 (-1 cr)" : "1-to-Many (-0.5 cr)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-[#A0AEC0] font-medium uppercase tracking-wide block mb-2">Select Time Slot</label>
                  <div className="flex flex-col gap-2">
                    {selectedTrainer.availability.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-2 ${
                          selectedSlot === slot
                            ? "bg-[#38A169]/20 border-[#38A169]/50 text-[#38A169]"
                            : "bg-white/5 border-white/10 text-[#A0AEC0] hover:text-[#EDF2F7]"
                        }`}
                      >
                        <Clock className="w-4 h-4 shrink-0" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-xs text-[#A0AEC0] font-medium uppercase tracking-wide block mb-2">Topic / Agenda</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder={`e.g. Learn ${selectedTrainer.teaches[0]} basics`}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-[#EDF2F7] placeholder-[#718096] outline-none focus:ring-1 focus:ring-[#2B6CB0]"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "rgba(43,108,176,0.15)", border: "1px solid rgba(43,108,176,0.3)" }}>
                  <div className="flex items-center gap-2 text-sm text-[#A0AEC0]">
                    <Coins className="w-4 h-4 text-[#D69E2E]" />
                    Credit cost
                  </div>
                  <span className="text-[#E53E3E] font-bold font-mono text-sm">-{creditCost} credit</span>
                </div>

                <button
                  disabled={!selectedSlot || booking}
                  onClick={handleConfirmBooking}
                  className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    selectedSlot && !booking
                      ? "bg-[#38A169] hover:bg-[#2F855A] text-white"
                      : "bg-white/10 text-[#718096] cursor-not-allowed"
                  }`}
                >
                  {booking ? "Booking..." : `Confirm & Pay ${creditCost} Credit`}
                </button>
              </>
            )}

            {bookingStep === "success" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#38A169]/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-[#38A169]" />
                </div>
                <h2 className="text-2xl font-bold text-[#EDF2F7] mb-2" style={{ fontFamily: "Fraunces, serif" }}>
                  Session Booked!
                </h2>
                <p className="text-[#A0AEC0] text-sm mb-2">
                  Your session with <span className="text-[#EDF2F7] font-medium">{selectedTrainer.name}</span> is confirmed.
                </p>
                <p className="text-[#E53E3E] font-medium text-sm mb-6">
                  -{creditCost} credit deducted from your wallet
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setSelectedTrainer(null); router.push("/dashboard/sessions"); router.refresh(); }}
                    className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl font-medium transition-colors"
                  >
                    View in Sessions
                  </button>
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-[#A0AEC0] rounded-xl font-medium transition-colors"
                  >
                    Back to Matches
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
