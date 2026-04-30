import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const allBadges = [
  {
    name: "Verified Student",
    icon: "🎓",
    color: "#38A169",
    border: "#38A169",
    desc: "Verified your college email address",
    requirement: "Complete email verification",
    category: "Account",
  },
  {
    name: "First Session",
    icon: "🚀",
    color: "#2B6CB0",
    border: "#2B6CB0",
    desc: "Completed your very first session",
    requirement: "Complete 1 session (teach or learn)",
    category: "Sessions",
  },
  {
    name: "5-Star Teacher",
    icon: "🌟",
    color: "#D69E2E",
    border: "#D69E2E",
    desc: "Received 5 consecutive 5-star ratings",
    requirement: "5 consecutive 5-star ratings",
    category: "Teaching",
  },
  {
    name: "Top Mentor",
    icon: "⭐",
    color: "#D69E2E",
    border: "#D69E2E",
    desc: "Maintained 4.5+ rating with 10+ sessions",
    requirement: "4.5+ rating, 10+ sessions taught",
    category: "Teaching",
  },
  {
    name: "10-Session Milestone",
    icon: "🏆",
    color: "#9F7AEA",
    border: "#9F7AEA",
    desc: "Completed 10 teaching sessions",
    requirement: "Teach 10 sessions",
    category: "Sessions",
  },
  {
    name: "Skill Expert",
    icon: "🎯",
    color: "#63B3ED",
    border: "#63B3ED",
    desc: "Passed a skill verification quiz",
    requirement: "Pass the skill verification quiz",
    category: "Skills",
  },
  {
    name: "Community Builder",
    icon: "🤝",
    color: "#38A169",
    border: "#38A169",
    desc: "Referred 5 new users to the platform",
    requirement: "Refer 5 new users",
    category: "Community",
  },
  {
    name: "Profile Champion",
    icon: "✨",
    color: "#E53E3E",
    border: "#E53E3E",
    desc: "Completed 100% of your profile",
    requirement: "Fill in all profile fields",
    category: "Account",
  },
  {
    name: "Quick Learner",
    icon: "⚡",
    color: "#D69E2E",
    border: "#D69E2E",
    desc: "Completed 5 learning sessions",
    requirement: "Attend 5 learning sessions",
    category: "Learning",
  },
  {
    name: "Multilingual",
    icon: "🌐",
    color: "#9F7AEA",
    border: "#9F7AEA",
    desc: "Uses the platform in multiple languages",
    requirement: "Switch language preference",
    category: "Community",
  },
  {
    name: "Night Owl",
    icon: "🦉",
    color: "#63B3ED",
    border: "#63B3ED",
    desc: "Completed a session after 10 PM",
    requirement: "Complete a session after 10 PM",
    category: "Sessions",
  },
  {
    name: "Credit Millionaire",
    icon: "💰",
    color: "#D69E2E",
    border: "#D69E2E",
    desc: "Accumulated 10+ credits through teaching",
    requirement: "Earn 10+ credits total",
    category: "Credits",
  },
];

export default async function BadgesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: userData } = await supabase.from('users').select('*').eq('user_id', user.id).single();
  const sessionCount = userData?.session_count ?? 0;

  // Determine earned badges based on user data
  const earnedBadgeNames = new Set<string>();
  earnedBadgeNames.add("Verified Student"); // Always earned (email verified on signup)
  if (sessionCount >= 1) earnedBadgeNames.add("First Session");
  if (sessionCount >= 10) earnedBadgeNames.add("10-Session Milestone");
  if ((userData?.rating_average ?? 0) >= 4.5 && sessionCount >= 10) earnedBadgeNames.add("Top Mentor");
  if (userData?.bio && userData?.profile_photo && userData?.college) earnedBadgeNames.add("Profile Champion");

  const earnedCount = earnedBadgeNames.size;
  const categories = [...new Set(allBadges.map(b => b.category))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            🏅 Badges & Achievements
          </h1>
          <p className="text-[#A0AEC0]">Earn badges by completing milestones on your learning journey</p>
        </div>

        {/* Progress Overview */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-[#EDF2F7]">Badge Progress</div>
                <div className="text-sm font-bold text-[#D69E2E] font-mono-jb">{earnedCount} / {allBadges.length}</div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(earnedCount / allBadges.length) * 100}%`,
                    background: "linear-gradient(90deg, #2B6CB0, #D69E2E)"
                  }}
                />
              </div>
              <div className="text-xs text-[#A0AEC0] mt-2">
                {allBadges.length - earnedCount} badges remaining
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D69E2E] font-mono-jb">{earnedCount}</div>
                <div className="text-xs text-[#A0AEC0]">Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#A0AEC0] font-mono-jb">{allBadges.length - earnedCount}</div>
                <div className="text-xs text-[#A0AEC0]">Locked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges by Category */}
        {categories.map(category => {
          const catBadges = allBadges.filter(b => b.category === category);
          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {catBadges.map(badge => {
                  const earned = earnedBadgeNames.has(badge.name);
                  return (
                    <div
                      key={badge.name}
                      className={`rounded-2xl p-5 text-center transition-all duration-200 ${
                        earned ? "hover:bg-white/10 hover:scale-105" : "opacity-50"
                      }`}
                      style={{
                        background: earned ? `${badge.color}10` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${earned ? badge.border + "40" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <div className={`text-4xl mb-3 ${!earned ? "grayscale" : ""}`} style={{ filter: earned ? "none" : "grayscale(1) opacity(0.4)" }}>
                        {badge.icon}
                      </div>
                      <div className={`text-sm font-semibold mb-1 ${earned ? "text-[#EDF2F7]" : "text-[#A0AEC0]"}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-[#A0AEC0] leading-relaxed mb-2">{badge.desc}</div>
                      {earned ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>
                          ✓ Earned
                        </div>
                      ) : (
                        <div className="text-xs text-[#A0AEC0] italic">{badge.requirement}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Top Mentor Badge Note */}
        <div className="glass-card rounded-2xl p-5 border border-[#D69E2E]/20 mt-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⭐</div>
            <div>
              <div className="font-medium text-[#D69E2E] mb-1">Top Mentor Badge — Admin Approval Required</div>
              <div className="text-sm text-[#A0AEC0]">
                The Top Mentor badge requires admin review to verify your 4.5+ rating and 10+ session count. Once your profile qualifies, it enters the approval queue automatically.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
