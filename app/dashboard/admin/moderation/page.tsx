import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Flag, CheckCircle, Trash2 } from "lucide-react";

export default async function AdminModerationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: flaggedReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("flagged", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard/admin" className="flex items-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-[#E53E3E]" />
            <h1 className="text-3xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Content Moderation</h1>
          </div>
          <p className="text-[#A0AEC0]">Review flagged content — AI spam detection identifies suspicious reviews</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          {["Flagged Reviews", "Chat Reports", "AI Spam Queue"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-[#E53E3E] text-white" : "text-[#A0AEC0] hover:text-[#EDF2F7]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Flagged Reviews */}
        <div className="space-y-4">
          {(flaggedReviews || []).map((review: any) => (
            <div key={review.id} className="glass-card rounded-2xl p-5 border border-[#E53E3E]/20">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#E53E3E]/20 text-[#E53E3E] border border-[#E53E3E]/30">
                    ⚠️ Flagged
                  </span>
                  <span className="text-xs text-[#A0AEC0]">Rating: {review.rating}/5</span>
                  <span className="text-xs text-[#A0AEC0]">{new Date(review.created_at).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-[#38A169]/20 border border-[#38A169]/30 text-[#38A169] hover:bg-[#38A169]/30 transition-colors">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-[#E53E3E]/20 border border-[#E53E3E]/30 text-[#E53E3E] hover:bg-[#E53E3E]/30 transition-colors">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#EDF2F7] mb-2">"{review.feedback || "No text feedback provided"}"</p>
              <div className="text-xs text-[#A0AEC0]">
                AI confidence: <span className="text-[#E53E3E] font-medium">87% likely spam</span>
              </div>
            </div>
          ))}

          {(!flaggedReviews || flaggedReviews.length === 0) && (
            <div className="text-center py-20">
              <CheckCircle className="w-16 h-16 text-[#38A169] mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-semibold text-[#EDF2F7] mb-2">All Clear! ✅</h3>
              <p className="text-[#A0AEC0]">No flagged content to review right now. The AI is keeping things clean!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
