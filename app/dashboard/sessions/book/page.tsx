"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { useState } from "react";
import { Calendar, Clock, Users, Coins, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/client";
import { useRouter } from "next/navigation";

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BookSessionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [sessionType, setSessionType] = useState<"1-on-1" | "1-to-Many">("1-on-1");
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [agenda, setAgenda] = useState("");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const today = new Date();
  const weekDates = days.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return { day: d, date: date.getDate(), full: date };
  });

  const creditCost = sessionType === "1-on-1" ? 1 : 0.5;

  const handleConfirmBooking = async () => {
    setBooking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase.from("users").select("credit_balance").eq("user_id", user.id).single();
      const currentBalance = userData?.credit_balance ?? 0;

      if (currentBalance < creditCost) {
        alert("Insufficient credits! Teach a session to earn more credits.");
        setBooking(false);
        return;
      }

      // Build scheduled date
      const selectedDate = weekDates[selectedDayIdx].full;
      const [hours, minutes] = (selectedSlot || "09:00").split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);

      // Create session record
      const { data: session, error } = await supabase.from("sessions").insert({
        learner_id: user.id,
        teacher_id: user.id, // In real app, would be selected match's user_id
        session_type: sessionType,
        status: "confirmed",
        scheduled_at: selectedDate.toISOString(),
        duration_minutes: 60,
        topic: topic || "General Learning Session",
        agenda: agenda,
        credit_cost: creditCost,
      }).select().single();

      if (error) throw error;

      // Deduct credits from learner
      const newBalance = currentBalance - creditCost;
      await supabase.from("users").update({ credit_balance: newBalance }).eq("user_id", user.id);

      // Log the credit transaction
      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -creditCost,
        type: "learn",
        description: `Session booked: ${topic || "General Learning Session"}`,
        session_id: session?.id || null,
      });

      // Create notification for the user
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "session",
        title: "Session Booked!",
        message: `Your ${sessionType} session has been confirmed for ${selectedDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} at ${selectedSlot}`,
        link: "/dashboard/sessions",
      });

      setBooked(true);
    } catch (e) {
      console.error(e);
    }
    setBooking(false);
  };

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0F1F35" }}>
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-full bg-[#38A169]/20 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-[#38A169]" />
          </div>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>Session Booked!</h1>
          <p className="text-[#A0AEC0] mb-6">
            Your session has been confirmed. <span className="text-[#E53E3E] font-medium">-{creditCost} credit</span> deducted from your wallet.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/sessions" className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl font-medium transition-colors text-center">
              View Sessions
            </Link>
            <Link href="/dashboard" className="w-full py-3 glass-card text-[#A0AEC0] rounded-xl font-medium hover:bg-white/10 transition-colors text-center">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <Link href="/dashboard/sessions" className="flex items-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>
            Book a Session
          </h1>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {["Select Type", "Pick Time", "Confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-sm font-medium ${step === i + 1 ? 'text-[#EDF2F7]' : step > i + 1 ? 'text-[#38A169]' : 'text-[#A0AEC0]'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? 'bg-[#2B6CB0] text-white' : step > i + 1 ? 'bg-[#38A169] text-white' : 'bg-white/10 text-[#A0AEC0]'}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {s}
              </div>
              {i < 2 && <ChevronRight className="w-4 h-4 text-[#A0AEC0]" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4">Session Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSessionType("1-on-1")}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${sessionType === "1-on-1" ? "border-[#2B6CB0] bg-[#2B6CB0]/10" : "border-white/10 hover:border-white/20"}`}
                >
                  <Users className="w-6 h-6 text-[#2B6CB0] mb-2" />
                  <div className="font-semibold text-[#EDF2F7] mb-1">1-on-1</div>
                  <div className="text-xs text-[#A0AEC0]">Private session with focused learning</div>
                  <div className="mt-3 text-sm font-bold text-[#E53E3E]">-1 credit</div>
                </button>
                <button
                  onClick={() => setSessionType("1-to-Many")}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${sessionType === "1-to-Many" ? "border-[#2B6CB0] bg-[#2B6CB0]/10" : "border-white/10 hover:border-white/20"}`}
                >
                  <Users className="w-6 h-6 text-[#38A169] mb-2" />
                  <div className="font-semibold text-[#EDF2F7] mb-1">Group (1-to-Many)</div>
                  <div className="text-xs text-[#A0AEC0]">Join a group session, up to 8 learners</div>
                  <div className="mt-3 text-sm font-bold text-[#E53E3E]">-0.5 credits</div>
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4">Session Topic</h2>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to learn? e.g., 'Python basics for data science'"
                className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                rows={3}
                placeholder="Agenda / specific topics to cover (optional)"
                className="w-full mt-3 px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm resize-none"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4">Select Date & Time</h2>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {weekDates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDayIdx(i)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl min-w-[60px] transition-colors ${selectedDayIdx === i ? "bg-[#2B6CB0] text-white" : "bg-white/5 text-[#A0AEC0] hover:bg-white/10"}`}
                  >
                    <span className="text-xs">{d.day}</span>
                    <span className="text-lg font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedSlot(time)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${selectedSlot === time ? "bg-[#2B6CB0] text-white" : "bg-white/5 text-[#A0AEC0] hover:bg-white/10"}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl font-medium hover:bg-white/10 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedSlot}
                className="flex-1 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4">Confirm Booking</h2>
              <div className="space-y-3">
                {[
                  { label: "Session Type", value: sessionType },
                  { label: "Topic", value: topic || "General session" },
                  { label: "Date", value: weekDates[selectedDayIdx]?.full.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" }) || "" },
                  { label: "Time", value: selectedSlot || "Not selected" },
                  { label: "Duration", value: "60 minutes" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-[#A0AEC0]">{item.label}</span>
                    <span className="text-sm text-[#EDF2F7] font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3">
                  <span className="text-sm font-semibold text-[#EDF2F7]">Credit Cost</span>
                  <span className="text-lg font-bold text-[#E53E3E] font-mono-jb">-{creditCost} credit</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-[#D69E2E]/20">
              <div className="flex items-center gap-2 text-sm text-[#D69E2E]">
                <Coins className="w-4 h-4" />
                <span>Both parties must confirm completion for credits to transfer</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl font-medium hover:bg-white/10 transition-colors">
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={booking}
                className="flex-1 py-3 bg-[#38A169] hover:bg-[#2F855A] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
