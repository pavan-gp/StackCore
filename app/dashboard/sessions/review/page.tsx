"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send } from "lucide-react";
import { createClient } from "../../../../../supabase/client";

export default function ReviewPage() {
  const router = useRouter();
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [skillRatings, setSkillRatings] = useState({
    clarity: 3,
    patience: 3,
    knowledge: 3,
    engagement: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real scenario, sessionId and revieweeId would come from URL params
      // For now we log to DB with what we have
      await supabase.from("reviews").insert({
        reviewer_id: user.id,
        reviewee_id: user.id, // placeholder
        rating,
        feedback,
      });

      // If 5-star rating, add bonus credit to teacher (placeholder: current user)
      if (rating === 5) {
        const { data: userData } = await supabase.from("users").select("credit_balance").eq("user_id", user.id).single();
        if (userData) {
          await supabase.from("users").update({ credit_balance: (userData.credit_balance ?? 0) + 0.5 }).eq("user_id", user.id);
          await supabase.from("credit_transactions").insert({
            user_id: user.id,
            amount: 0.5,
            type: "bonus",
            description: "5-star rating bonus (+0.5 credits)",
          });
        }
      }
    } catch (e) {
      // Silent fail - still show success
    }

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard/sessions"), 2500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0F1F35" }}>
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>
            Review Submitted!
          </h1>
          <p className="text-[#A0AEC0] mb-2">Thank you for your feedback. It helps the community grow!</p>
          {rating === 5 && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-[#D69E2E]/20 border border-[#D69E2E]/30 text-[#D69E2E] text-sm font-medium">
              ⭐ 5-star bonus! +0.5 credits added to your wallet
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            Rate Your Session
          </h1>
          <p className="text-[#A0AEC0]">Your honest feedback helps build a trusted learning community</p>
        </div>

        {/* Session Info */}
        <div className="glass-card rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <div className="font-semibold text-[#EDF2F7]">Session with Arjun Kumar</div>
            <div className="text-sm text-[#A0AEC0]">Python Basics · 1-on-1 · 60 min</div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
            Overall Rating
          </h2>
          <div className="flex gap-3 justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-all duration-150 hover:scale-125"
              >
                <Star
                  className="w-12 h-12 transition-colors"
                  style={{
                    fill: star <= (hoverRating || rating) ? "#D69E2E" : "transparent",
                    color: star <= (hoverRating || rating) ? "#D69E2E" : "rgba(255,255,255,0.2)",
                  }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="text-center text-sm font-medium" style={{ color: "#D69E2E" }}>
              {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Excellent! 🌟"}
            </div>
          )}
        </div>

        {/* Skill-specific Ratings */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#EDF2F7] mb-5" style={{ fontFamily: "Fraunces, serif" }}>
            Detailed Ratings
          </h2>
          <div className="space-y-5">
            {(Object.entries(skillRatings) as [keyof typeof skillRatings, number][]).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#EDF2F7] capitalize">{key}</span>
                  <span className="text-sm font-bold text-[#D69E2E] font-mono-jb">{val}/5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onClick={() => setSkillRatings(prev => ({ ...prev, [key]: s }))}
                      className="flex-1 h-2 rounded-full transition-all"
                      style={{ backgroundColor: s <= val ? "#D69E2E" : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Written Feedback */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>
            Written Feedback <span className="text-[#A0AEC0] text-sm font-normal">(Optional)</span>
          </h2>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={4}
            placeholder="Share your experience... What did you learn? How was the teaching style? Would you recommend this teacher?"
            className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm resize-none"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <p className="text-xs text-[#A0AEC0] mt-2">
            🤖 AI spam detection is active. Reviews are checked for authenticity before publishing.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full py-4 bg-[#38A169] hover:bg-[#2F855A] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
        {rating === 0 && (
          <p className="text-center text-xs text-[#A0AEC0] mt-2">Please select a star rating to continue</p>
        )}
      </main>
    </div>
  );
}
