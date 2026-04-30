import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "#D69E2E", bg: "#D69E2E20", label: "Pending" },
  confirmed: { color: "#63B3ED", bg: "#2B6CB020", label: "Confirmed" },
  completed: { color: "#38A169", bg: "#38A16920", label: "Completed" },
  cancelled: { color: "#E53E3E", bg: "#E53E3E20", label: "Cancelled" },
};

export default async function AdminSessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: totalSessions } = await supabase.from("sessions").select("*", { count: "exact", head: true });
  const { count: activeSessions } = await supabase.from("sessions").select("*", { count: "exact", head: true }).eq("status", "confirmed");
  const { count: completedSessions } = await supabase.from("sessions").select("*", { count: "exact", head: true }).eq("status", "completed");
  const { count: cancelledSessions } = await supabase.from("sessions").select("*", { count: "exact", head: true }).eq("status", "cancelled");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/dashboard/admin" className="flex items-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <Calendar className="w-6 h-6 text-[#38A169]" />
            <h1 className="text-3xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Session Monitor</h1>
          </div>
          <p className="text-[#A0AEC0]">All platform sessions — active, completed, and flagged</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sessions", value: totalSessions || 0, color: "#2B6CB0" },
            { label: "Active / Confirmed", value: activeSessions || 0, color: "#D69E2E" },
            { label: "Completed", value: completedSessions || 0, color: "#38A169" },
            { label: "Cancelled", value: cancelledSessions || 0, color: "#E53E3E" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="text-xs text-[#A0AEC0] font-medium mb-2">{stat.label}</div>
              <div className="text-3xl font-bold font-mono-jb" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Sessions Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>All Sessions</h2>
            <div className="flex gap-2">
              {["All", "Confirmed", "Completed", "Pending", "Cancelled"].map((f, i) => (
                <button key={f} className={`px-3 py-1 text-xs rounded-lg transition-colors ${i === 0 ? "bg-[#2B6CB0] text-white" : "text-[#A0AEC0] hover:text-[#EDF2F7] hover:bg-white/5"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Topic</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Scheduled</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Credits</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {(sessions || []).map((s: any, i: number) => {
                  const cfg = statusConfig[s.status] || statusConfig.pending;
                  return (
                    <tr key={s.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors`}>
                      <td className="p-4">
                        <div className="text-sm font-medium text-[#EDF2F7]">{s.topic || "Untitled Session"}</div>
                        {s.agenda && <div className="text-xs text-[#A0AEC0] mt-0.5 truncate max-w-xs">{s.agenda}</div>}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[#2B6CB0]/20 text-[#63B3ED]">
                          {s.session_type || "1-on-1"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#A0AEC0]">
                        {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold font-mono-jb text-[#D69E2E]">
                          {s.credit_cost || 1} cr
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#A0AEC0]">
                        {new Date(s.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!sessions || sessions.length === 0) && (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-[#A0AEC0] mx-auto mb-4 opacity-30" />
                <p className="text-[#A0AEC0]">No sessions yet on the platform</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
