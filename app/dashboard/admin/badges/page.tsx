import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Award, CheckCircle, XCircle, Clock } from "lucide-react";

export default async function AdminBadgesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  // Fetch users who qualify for Top Mentor but haven't gotten it yet
  const { data: qualifyingUsers } = await supabase
    .from("users")
    .select("*")
    .gte("rating_average", 4.5)
    .gte("session_count", 10)
    .order("rating_average", { ascending: false });

  const mockQueue = [
    { id: "1", name: "Arjun Kumar", college: "IIT Bangalore", rating: 4.9, sessions: 14, badge: "Top Mentor", status: "pending" },
    { id: "2", name: "Priya Sharma", college: "BITS Pilani", rating: 4.8, sessions: 18, badge: "Top Mentor", status: "pending" },
    { id: "3", name: "Rahul Nair", college: "NIT Trichy", rating: 4.7, sessions: 12, badge: "Skill Expert", status: "pending" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Link href="/dashboard/admin" className="flex items-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-6 h-6 text-[#D69E2E]" />
            <h1 className="text-3xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Badge Approval Queue</h1>
          </div>
          <p className="text-[#A0AEC0]">Review and approve badge requests — Top Mentor badges require manual admin verification</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-5">
            <div className="text-xs text-[#A0AEC0] mb-2">Pending Review</div>
            <div className="text-3xl font-bold text-[#D69E2E] font-mono-jb">{mockQueue.length}</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-xs text-[#A0AEC0] mb-2">Approved This Month</div>
            <div className="text-3xl font-bold text-[#38A169] font-mono-jb">7</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-xs text-[#A0AEC0] mb-2">Total Badged Users</div>
            <div className="text-3xl font-bold text-[#63B3ED] font-mono-jb">{qualifyingUsers?.length || 0 + 7}</div>
          </div>
        </div>

        {/* Badge Types Info */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>Badge Types Requiring Approval</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "⭐", name: "Top Mentor", criteria: "4.5+ rating AND 10+ teaching sessions", auto: false },
              { icon: "🎓", name: "Verified Student", criteria: "College email verified (auto-awarded)", auto: true },
              { icon: "🌟", name: "5-Star Teacher", criteria: "5 consecutive 5-star ratings (auto-detected)", auto: true },
              { icon: "🎯", name: "Skill Expert", criteria: "Pass skill verification quiz (manual review)", auto: false },
            ].map((badge, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-medium text-[#EDF2F7] text-sm">{badge.name}</div>
                  <div className="text-xs text-[#A0AEC0] mt-0.5">{badge.criteria}</div>
                  <div className={`mt-1 text-xs font-medium ${badge.auto ? "text-[#38A169]" : "text-[#D69E2E]"}`}>
                    {badge.auto ? "✅ Auto-awarded" : "⏳ Manual approval required"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#D69E2E]" />
            <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Pending Approvals</h2>
          </div>
          <div className="space-y-4">
            {mockQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-[#D69E2E]/20 bg-[#D69E2E]/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-bold text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-[#EDF2F7] text-sm">{item.name}</div>
                    <div className="text-xs text-[#A0AEC0]">{item.college}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#D69E2E]">⭐ {item.rating} rating</span>
                      <span className="text-xs text-[#A0AEC0]">•</span>
                      <span className="text-xs text-[#63B3ED]">{item.sessions} sessions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-[#D69E2E]/20 text-[#D69E2E] border border-[#D69E2E]/30">
                    {item.badge}
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-[#38A169]/20 border border-[#38A169]/30 text-[#38A169] hover:bg-[#38A169]/30 transition-colors">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-[#E53E3E]/20 border border-[#E53E3E]/30 text-[#E53E3E] hover:bg-[#E53E3E]/30 transition-colors">
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
