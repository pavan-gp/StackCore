import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Award, Edit, BookOpen, TrendingUp, CheckCircle } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: userData } = await supabase.from('users').select('*').eq('user_id', user.id).single();

  // Fetch real skills from DB
  const { data: teachSkillsData } = await supabase
    .from('user_skills_teach')
    .select('skills(name)')
    .eq('user_id', user.id);
  const { data: learnSkillsData } = await supabase
    .from('user_skills_learn')
    .select('skills(name)')
    .eq('user_id', user.id);

  const skillsTeach = (teachSkillsData || []).map((s: any) => s.skills?.name).filter(Boolean);
  const skillsLearn = (learnSkillsData || []).map((s: any) => s.skills?.name).filter(Boolean);

  const displayName = userData?.name || userData?.full_name || user.email?.split('@')[0] || 'Student';
  const creditBalance = userData?.credit_balance ?? 2;
  const sessionCount = userData?.session_count ?? 0;

  const badges = [
    { name: "Verified Student", icon: "🎓", earned: true, desc: "College email verified" },
    { name: "Top Mentor", icon: "⭐", earned: (userData?.rating_average ?? 0) >= 4.5 && sessionCount >= 10, desc: "4.5+ rating with 10+ sessions" },
    { name: "5-Star Teacher", icon: "🌟", earned: false, desc: "5 consecutive 5-star ratings" },
    { name: "10-Session Milestone", icon: "🏆", earned: sessionCount >= 10, desc: "Complete 10 sessions" },
    { name: "Skill Expert", icon: "🎯", earned: false, desc: "Pass skill verification quiz" },
    { name: "Community Builder", icon: "🤝", earned: false, desc: "Refer 5 new users" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Profile Card */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                {displayName[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
                {displayName}
              </h2>
              <p className="text-sm text-[#A0AEC0] mb-3">{user.email}</p>
              {userData?.college && (
                <p className="text-xs text-[#63B3ED] mb-4">{userData.college}</p>
              )}

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center">
                  <div className="text-xl font-bold text-[#EDF2F7] font-mono-jb">{creditBalance.toFixed(1)}</div>
                  <div className="text-xs text-[#A0AEC0]">Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#EDF2F7] font-mono-jb">{userData?.session_count ?? 0}</div>
                  <div className="text-xs text-[#A0AEC0]">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#EDF2F7] font-mono-jb">{(userData?.rating_average ?? 0).toFixed(1)}</div>
                  <div className="text-xs text-[#A0AEC0]">Rating</div>
                </div>
              </div>

              <div className="flex gap-1 justify-center mb-5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(userData?.rating_average ?? 0) ? 'fill-[#D69E2E] text-[#D69E2E]' : 'text-white/20'}`} />
                ))}
              </div>

              <Link
                href="/dashboard/profile/edit"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2B6CB0]/20 hover:bg-[#2B6CB0]/30 border border-[#2B6CB0]/30 rounded-xl text-[#63B3ED] text-sm font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            {/* Bio */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-[#EDF2F7] mb-2 text-sm">About Me</h3>
              <p className="text-sm text-[#A0AEC0] leading-relaxed">
                {userData?.bio || "No bio yet. Add one to earn +0.5 credits!"}
              </p>
            </div>
          </div>

          {/* Right - Skills & Badges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills I Can Teach */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>
                  Skills I Teach
                </h2>
                <Link href="/dashboard/profile/edit" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED] flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Add skill
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsTeach.map(skill => (
                  <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#38A169]/20 border border-[#38A169]/30">
                    <span className="text-sm text-[#38A169] font-medium">{skill}</span>
                    <CheckCircle className="w-3 h-3 text-[#38A169]" />
                  </div>
                ))}
                {skillsTeach.length === 0 && (
                  <p className="text-sm text-[#A0AEC0]">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Skills I Want to Learn */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>
                  Skills I Want to Learn
                </h2>
                <Link href="/dashboard/profile/edit" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Add goal
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsLearn.map(skill => (
                  <div key={skill} className="px-3 py-1.5 rounded-full bg-[#2B6CB0]/20 border border-[#2B6CB0]/30">
                    <span className="text-sm text-[#63B3ED] font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>
                  Badges & Achievements
                </h2>
                <Link href="/dashboard/badges" className="text-xs text-[#2B6CB0] hover:text-[#63B3ED]">View all</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      badge.earned
                        ? "bg-[#D69E2E]/10 border-[#D69E2E]/30"
                        : "bg-white/3 border-white/10 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <div className={`text-xs font-semibold mb-1 ${badge.earned ? "text-[#D69E2E]" : "text-[#A0AEC0]"}`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-[#A0AEC0]">{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
