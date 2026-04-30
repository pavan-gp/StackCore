import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, Coins, Shield, Flag, CheckCircle, XCircle, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  // Fetch platform stats
  const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true });
  const { count: sessionCount } = await supabase.from("sessions").select("*", { count: "exact", head: true });
  const { count: completedSessions } = await supabase.from("sessions").select("*", { count: "exact", head: true }).eq("status", "completed");
  const { data: txData } = await supabase.from("credit_transactions").select("amount");
  const totalCreditsInCirculation = txData?.filter(t => t.amount > 0).reduce((s: number, t: any) => s + t.amount, 0) || 0;

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch flagged reviews
  const { data: flaggedReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("flagged", true)
    .limit(5);

  // Fetch recent sessions
  const { data: recentSessions } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    { label: "Total Users", value: userCount || 0, icon: Users, color: "#2B6CB0" },
    { label: "Total Sessions", value: sessionCount || 0, icon: Calendar, color: "#38A169" },
    { label: "Completed Sessions", value: completedSessions || 0, icon: CheckCircle, color: "#38A169" },
    { label: "Credits in Circulation", value: totalCreditsInCirculation.toFixed(1), icon: Coins, color: "#D69E2E" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-6 h-6 text-[#E53E3E]" />
              <h1 className="text-3xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Admin Dashboard</h1>
            </div>
            <p className="text-[#A0AEC0]">Platform overview and management tools</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin/users" className="px-4 py-2 glass-card rounded-xl text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
              User Management
            </Link>
            <Link href="/dashboard/admin/moderation" className="px-4 py-2 bg-[#E53E3E]/20 border border-[#E53E3E]/30 rounded-xl text-sm text-[#E53E3E] hover:bg-[#E53E3E]/30 transition-colors">
              {(flaggedReviews?.length || 0)} Flagged
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#A0AEC0] font-medium">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#EDF2F7] font-mono-jb">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Recent Users</h2>
              <Link href="/dashboard/admin/users" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED]">View all</Link>
            </div>
            <div className="space-y-3">
              {(recentUsers || []).map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-bold text-sm">
                      {(u.name || u.full_name || u.email || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#EDF2F7]">{u.name || u.full_name || "Student"}</div>
                      <div className="text-xs text-[#A0AEC0]">{u.email || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-jb text-[#D69E2E]">{(u.credit_balance ?? 0).toFixed(1)} cr</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#38A169]/20 text-[#38A169]">Active</span>
                  </div>
                </div>
              ))}
              {(!recentUsers || recentUsers.length === 0) && (
                <p className="text-[#A0AEC0] text-sm text-center py-4">No users found</p>
              )}
            </div>
          </div>

          {/* Session Monitor */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Recent Sessions</h2>
              <Link href="/dashboard/admin/sessions" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED]">View all</Link>
            </div>
            <div className="space-y-3">
              {(recentSessions || []).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-[#EDF2F7]">{s.topic || "Untitled Session"}</div>
                    <div className="text-xs text-[#A0AEC0]">{s.session_type} · {new Date(s.created_at).toLocaleDateString("en-IN")}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    s.status === "completed" ? "bg-[#38A169]/20 text-[#38A169]" :
                    s.status === "confirmed" ? "bg-[#2B6CB0]/20 text-[#63B3ED]" :
                    s.status === "cancelled" ? "bg-[#E53E3E]/20 text-[#E53E3E]" :
                    "bg-[#D69E2E]/20 text-[#D69E2E]"
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
              {(!recentSessions || recentSessions.length === 0) && (
                <p className="text-[#A0AEC0] text-sm text-center py-4">No sessions found</p>
              )}
            </div>
          </div>

          {/* Flagged Reviews */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#E53E3E]" />
                <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Flagged Reviews</h2>
              </div>
              <Link href="/dashboard/admin/moderation" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED]">View all</Link>
            </div>
            {(flaggedReviews || []).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-[#38A169] mx-auto mb-2 opacity-60" />
                <p className="text-[#A0AEC0] text-sm">No flagged reviews — community looks clean! ✅</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(flaggedReviews || []).map((r: any) => (
                  <div key={r.id} className="p-3 rounded-xl border border-[#E53E3E]/20 bg-[#E53E3E]/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-[#E53E3E] font-medium">⚠️ Flagged Review</span>
                      <div className="flex gap-2">
                        <button className="text-xs text-[#38A169] hover:underline">Approve</button>
                        <button className="text-xs text-[#E53E3E] hover:underline">Remove</button>
                      </div>
                    </div>
                    <p className="text-sm text-[#A0AEC0]">{r.feedback || "No feedback text"}</p>
                    <div className="text-xs text-[#A0AEC0] mt-1">Rating: {r.rating}/5</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>Admin Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "User Management", icon: Users, href: "/dashboard/admin/users", color: "#2B6CB0" },
                { label: "Session Monitor", icon: Calendar, href: "/dashboard/admin/sessions", color: "#38A169" },
                { label: "Badge Approvals", icon: CheckCircle, href: "/dashboard/admin/badges", color: "#D69E2E" },
                { label: "Content Moderation", icon: Flag, href: "/dashboard/admin/moderation", color: "#E53E3E" },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
                  style={{ backgroundColor: `${action.color}10`, border: `1px solid ${action.color}30` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-[#EDF2F7] text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
