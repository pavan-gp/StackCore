"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle, GraduationCap } from "lucide-react";

const statusConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  pending: { color: "#D69E2E", bg: "#D69E2E20", icon: AlertCircle, label: "Pending" },
  confirmed: { color: "#2B6CB0", bg: "#2B6CB020", icon: Clock, label: "Confirmed" },
  completed: { color: "#38A169", bg: "#38A16920", icon: CheckCircle, label: "Completed" },
  cancelled: { color: "#E53E3E", bg: "#E53E3E20", icon: XCircle, label: "Cancelled" },
};

const tabs = ["All", "Upcoming", "Completed", "Cancelled"] as const;
type Tab = typeof tabs[number];

export default function SessionsClient({ sessions }: { sessions: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const now = new Date();

  const filteredSessions = sessions.filter((s) => {
    const scheduledAt = new Date(s.scheduled_at);
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") return s.status !== "completed" && s.status !== "cancelled" && scheduledAt >= now;
    if (activeTab === "Completed") return s.status === "completed";
    if (activeTab === "Cancelled") return s.status === "cancelled";
    return true;
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            Sessions
          </h1>
          <p className="text-[#A0AEC0]">Manage your teaching and learning sessions</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/sessions/teach"
            className="flex items-center gap-2 px-4 py-2 bg-[#38A169] hover:bg-[#2F855A] text-white rounded-xl text-sm font-medium transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Teach a Session
          </Link>
          <Link
            href="/dashboard/match"
            className="flex items-center gap-2 px-4 py-2 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Users className="w-4 h-4" />
            Find a Trainer
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#2B6CB0] text-white"
                : "text-[#A0AEC0] hover:text-[#EDF2F7]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session: any) => {
          const statusCfg = statusConfig[session.status] || statusConfig.pending;
          const StatusIcon = statusCfg.icon;
          const sessionDate = new Date(session.scheduled_at);
          const isPast = sessionDate < now;

          return (
            <div key={session.id} className="glass-card rounded-2xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: statusCfg.bg }}
                  >
                    <StatusIcon className="w-5 h-5" style={{ color: statusCfg.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#EDF2F7] mb-1">
                      {session.topic || "Untitled Session"}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-[#A0AEC0]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {sessionDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sessionDate.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>{session.duration_minutes || 60} min</span>
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#2B6CB020", color: "#63B3ED" }}
                      >
                        {session.session_type || "1-on-1"}
                      </span>
                      {session.role && (
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            session.role === "teacher"
                              ? "bg-[#38A169]/20 text-[#38A169]"
                              : "bg-[#2B6CB0]/20 text-[#63B3ED]"
                          }`}
                        >
                          {session.role === "teacher" ? "📚 Teaching" : "🎓 Learning"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-mono-jb ${
                        session.status === "completed"
                          ? session.role === "learner"
                            ? "text-[#E53E3E]"
                            : "text-[#38A169]"
                          : "text-[#A0AEC0]"
                      }`}
                    >
                      {session.status === "completed"
                        ? session.role === "learner"
                          ? `-${session.credit_cost || 1} credit`
                          : `+${session.credit_cost || 1} credit`
                        : `${session.credit_cost || 1} credit`}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <StatusIcon className="w-3 h-3" style={{ color: statusCfg.color }} />
                      <span className="text-xs" style={{ color: statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {session.status === "confirmed" && !isPast && (
                    <Link
                      href={`/dashboard/sessions/${session.id}/live`}
                      className="px-4 py-2 bg-[#38A169] hover:bg-[#2F855A] text-white text-sm rounded-xl font-medium transition-colors"
                    >
                      Join Call
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-[#A0AEC0] mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold text-[#EDF2F7] mb-2">
            {activeTab === "All" ? "No sessions yet" : `No ${activeTab.toLowerCase()} sessions`}
          </h3>
          <p className="text-[#A0AEC0] mb-6">
            {activeTab === "All"
              ? "Find a skill match and book your first session!"
              : `You have no ${activeTab.toLowerCase()} sessions.`}
          </p>
          {activeTab === "All" && (
            <Link
              href="/dashboard/match"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B6CB0] text-white rounded-xl font-medium"
            >
              Find a Match
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
