"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../supabase/client";
import {
  BookOpen,
  Users,
  Coins,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Tag,
  FileText,
  Clock,
  Star,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TeachSessionPage() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] = useState("1-on-1");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [duration, setDuration] = useState(60);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [visibility, setVisibility] = useState("public");
  const [maxLearners, setMaxLearners] = useState(4);
  const [userCredits, setUserCredits] = useState<number | null>(null);

  const today = new Date();

  const weekDates = days.map((day, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      day,
      date: date.getDate(),
      full: date,
    };
  });

  const baseCredit = duration / 60;

  const creditEarning =
    sessionType === "1-on-1"
      ? baseCredit
      : Math.min(maxLearners * (baseCredit * 0.5), 4);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("credit_balance")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setUserCredits(data.credit_balance);
      }
    };

    loadUser();
  }, []);

  const handleCreateSession = async () => {
    if (!title || !selectedSlot) return;

    setCreating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const selectedDate = new Date(weekDates[selectedDayIdx].full);
      const [hour, minute] = selectedSlot.split(":").map(Number);

      selectedDate.setHours(hour, minute, 0, 0);

      // Insert session with teacher_id set to the current user (no learner yet)
      const { error: sessionError } = await supabase.from("sessions").insert({
        teacher_id: user.id,
        learner_id: null,
        topic: title,
        agenda: description,
        session_type: sessionType,
        scheduled_at: selectedDate.toISOString(),
        duration_minutes: duration,
        credit_cost: sessionType === "1-on-1" ? baseCredit : baseCredit * 0.5,
        status: "pending",
      });

      if (sessionError) throw sessionError;

      // Add credits to the teacher's wallet immediately
      const { data: userData } = await supabase
        .from("users")
        .select("credit_balance")
        .eq("user_id", user.id)
        .single();

      const currentBalance = userData?.credit_balance ?? 0;
      const newBalance = currentBalance + creditEarning;

      await supabase
        .from("users")
        .update({ credit_balance: newBalance })
        .eq("user_id", user.id);

      // Log the credit transaction
      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: creditEarning,
        type: "earned",
        description: `Teaching session created: ${title}`,
        session_id: null,
      });

      setCreated(true);
    } catch (error) {
      console.error(error);
    }

    setCreating(false);
  };

  if (created) {
    return (
      <div className="min-h-screen bg-[#0F1F35] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-full bg-[#38A169]/20 border-2 border-[#38A169] flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-[#38A169]" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Session Created 🎉
          </h1>

          <p className="text-gray-300 mb-4">
            Your teaching session is now live and ready for learners!
          </p>

          {/* Credit earned banner */}
          <div className="mb-6 p-4 rounded-xl bg-[#38A169]/10 border border-[#38A169]/30">
            <div className="text-sm text-[#A0AEC0] mb-1">Credits Added to Your Wallet</div>
            <div className="text-3xl font-bold text-[#38A169] font-mono">
              +{creditEarning} cr
            </div>
            <div className="text-xs text-[#A0AEC0] mt-1">
              {sessionType === "1-on-1" ? "1-on-1 teaching reward" : `Group session reward (${maxLearners} learner slots)`}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/wallet"
              className="flex-1 py-3 bg-[#38A169] hover:bg-[#2F855A] rounded-xl text-white font-semibold transition-colors"
            >
              View Wallet
            </Link>
            <Link
              href="/dashboard/sessions"
              className="flex-1 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] rounded-xl text-white font-semibold transition-colors"
            >
              View Sessions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1F35] text-white">
      <DashboardNavbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/dashboard/sessions"
          className="flex items-center gap-1 text-gray-400 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold mb-6">Offer a Session</h1>

        <div className="mb-6 p-4 rounded-xl bg-white/5">
          <div className="text-sm text-gray-400">Potential Earnings</div>

          <div className="text-2xl font-bold text-green-400">
            +{creditEarning}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-white/5">
              <h2 className="font-semibold mb-4">Session Type</h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSessionType("1-on-1")}
                  className="p-4 rounded-xl bg-green-600"
                >
                  1-on-1
                </button>

                <button
                  onClick={() => setSessionType("1-to-Many")}
                  className="p-4 rounded-xl bg-blue-600"
                >
                  Group
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5">
              <label className="block mb-2 text-sm">Title</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/20"
                placeholder="Python Basics"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!title}
              className="w-full py-3 bg-green-600 rounded-xl"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-white/5">
              <h2 className="mb-4 font-semibold">Select Time</h2>

              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className="p-2 rounded-lg bg-black/20"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-700 rounded-xl"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-green-600 rounded-xl"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-white/5">
              <h2 className="mb-4 font-semibold">Settings</h2>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/20 mb-3"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Kannada</option>
              </select>

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/20"
              >
                <option value="public">Public</option>
                <option value="invite-only">Invite Only</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-700 rounded-xl"
              >
                Back
              </button>

              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-green-600 rounded-xl"
              >
                Review
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-white/5">
              <h2 className="mb-4 font-semibold">Review</h2>

              <p className="mb-2">
                <strong>Title:</strong> {title}
              </p>

              <p className="mb-2">
                <strong>Type:</strong> {sessionType}
              </p>

              <p className="mb-2">
                <strong>Time:</strong> {selectedSlot}
              </p>

              <p>
                <strong>Earning:</strong> +{creditEarning}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-gray-700 rounded-xl"
              >
                Back
              </button>

              <button
                onClick={handleCreateSession}
                disabled={creating}
                className="flex-1 py-3 bg-green-600 rounded-xl"
              >
                {creating ? "Creating..." : "Create Session"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
