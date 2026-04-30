import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Coins, Users, BookOpen, Star, ArrowRight, TrendingUp,
  Calendar, MessageSquare, Award, Zap, ChevronRight, Bell
} from "lucide-react";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('*')
    .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const creditBalance = userData?.credit_balance ?? 2;
  const displayName = userData?.name || userData?.full_name || user.email?.split('@')[0] || 'Student';

  const quickActions = [
    { href: '/dashboard/match', icon: Users, label: 'Find Match', color: '#2B6CB0', bg: '#2B6CB0' },
    { href: '/dashboard/sessions', icon: Calendar, label: 'Book Session', color: '#38A169', bg: '#38A169' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages', color: '#D69E2E', bg: '#D69E2E' },
    { href: '/dashboard/profile', icon: Award, label: 'My Profile', color: '#9F7AEA', bg: '#9F7AEA' },
  ];

  const suggestedMatches = [
    { name: "Arjun K.", teaches: "Python", wants: "Guitar", match: 94, rating: 4.8 },
    { name: "Priya S.", teaches: "Web Design", wants: "ML", match: 87, rating: 4.9 },
    { name: "Rahul N.", teaches: "Guitar", wants: "Python", match: 91, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-[#A0AEC0]">Here's what's happening on your learning journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-[#A0AEC0]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E53E3E] rounded-full"></span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Credit Balance",
              value: creditBalance.toFixed(1),
              icon: Coins,
              color: "#D69E2E",
              desc: "Available credits",
              prefix: "⚡",
            },
            {
              label: "Sessions Taught",
              value: userData?.session_count ?? 0,
              icon: BookOpen,
              color: "#38A169",
              desc: "Total sessions",
            },
            {
              label: "Your Rating",
              value: (userData?.rating_average ?? 0).toFixed(1),
              icon: Star,
              color: "#D69E2E",
              desc: "Average rating",
            },
            {
              label: "Streak",
              value: `${userData?.streak_days ?? 0}`,
              icon: TrendingUp,
              color: "#2B6CB0",
              desc: "Days active",
              suffix: "days",
            },
          ].map((stat, i) => (
            <div key={i} className={`glass-card rounded-2xl p-5 animate-fade-in-up stagger-${i + 1}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-[#A0AEC0] font-medium">{stat.label}</div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#EDF2F7] font-mono-jb">
                {stat.prefix}{stat.value}{stat.suffix ? ` ${stat.suffix}` : ''}
              </div>
              <div className="text-xs text-[#A0AEC0] mt-1">{stat.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-105 group"
                    style={{ backgroundColor: `${action.bg}10`, border: `1px solid ${action.bg}30` }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${action.bg}20` }}>
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <span className="text-xs font-medium text-[#EDF2F7]">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Suggested Matches */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>
                  🤖 AI Suggested Matches
                </h2>
                <Link href="/dashboard/match" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED] flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {suggestedMatches.map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-semibold text-sm">
                        {match.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-[#EDF2F7] text-sm">{match.name}</div>
                        <div className="text-xs text-[#A0AEC0]">
                          <span className="text-[#38A169]">Teaches {match.teaches}</span>
                          {" → "}
                          <span className="text-[#63B3ED]">Wants {match.wants}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#D69E2E]">{match.match}% match</div>
                        <div className="text-xs text-[#A0AEC0]">★ {match.rating}</div>
                      </div>
                      <Link
                        href="/dashboard/match"
                        className="px-3 py-1.5 text-xs bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Connect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Recent Sessions</h2>
                <Link href="/dashboard/sessions" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED] flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {recentSessions && recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#A0AEC0]" />
                        <div>
                          <div className="text-sm text-[#EDF2F7]">{session.topic || "Untitled Session"}</div>
                          <div className="text-xs text-[#A0AEC0]">{session.session_type}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        session.status === 'completed'
                          ? 'bg-[#38A169]/20 text-[#38A169]'
                          : session.status === 'pending'
                          ? 'bg-[#D69E2E]/20 text-[#D69E2E]'
                          : 'bg-[#2B6CB0]/20 text-[#63B3ED]'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-[#A0AEC0] mx-auto mb-3 opacity-50" />
                  <p className="text-[#A0AEC0] text-sm">No sessions yet</p>
                  <Link href="/dashboard/match" className="inline-flex items-center gap-1 mt-3 text-sm text-[#2B6CB0] hover:text-[#63B3ED]">
                    Find your first match <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Credit Widget */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2B6CB0 100%)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-100">Your Credits</span>
                <Coins className="w-5 h-5 text-[#D69E2E]" />
              </div>
              <div className="text-5xl font-bold text-white mb-1 font-mono-jb animate-count-up">
                {creditBalance.toFixed(1)}
              </div>
              <div className="text-sm text-blue-200 mb-4">credits available</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-200">Teach session</span>
                  <span className="text-[#38A169] font-semibold">+1 credit</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-200">Learn session</span>
                  <span className="text-[#E53E3E] font-semibold">-1 credit</span>
                </div>
              </div>
              <Link
                href="/dashboard/wallet"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-colors"
              >
                View Wallet <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Profile Completion */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#EDF2F7] mb-4">Profile Completion</h2>
              <div className="space-y-3">
                {[
                  { label: "Email verified", done: true, credits: "+2" },
                  { label: "Photo uploaded", done: !!userData?.profile_photo, credits: "+0.5" },
                  { label: "Bio written", done: !!userData?.bio, credits: "+0.5" },
                  { label: "Skills added", done: false, credits: "+1" },
                  { label: "Learning goals", done: false, credits: "+0.5" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-[#38A169]' : 'bg-white/10 border border-white/20'}`}>
                        {item.done && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-xs ${item.done ? 'text-[#EDF2F7]' : 'text-[#A0AEC0]'}`}>{item.label}</span>
                    </div>
                    <span className="text-xs font-mono-jb text-[#D69E2E]">{item.credits}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/profile/edit" className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-[#2B6CB0]/20 hover:bg-[#2B6CB0]/30 border border-[#2B6CB0]/30 rounded-xl text-[#63B3ED] text-sm font-medium transition-colors">
                Complete Profile
              </Link>
            </div>

            {/* Recent Transactions */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-[#EDF2F7]">Recent Credits</h2>
                <Link href="/dashboard/wallet" className="text-xs text-[#2B6CB0]">View all</Link>
              </div>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-[#A0AEC0]">{tx.description}</span>
                      <span className={`text-xs font-semibold font-mono-jb ${tx.amount > 0 ? 'text-[#38A169]' : 'text-[#E53E3E]'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-[#A0AEC0]">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
