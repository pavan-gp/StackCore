"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import { Check, ArrowRight, Coins } from "lucide-react";

const allSkills = ["Python", "JavaScript", "React", "Guitar", "Piano", "Web Design", "UI/UX", "Figma", "Data Science", "Machine Learning", "Java", "Photography", "Marketing", "Mathematics", "English Speaking", "Kannada", "Hindi"];

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [showBonus, setShowBonus] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    college: "",
    language: "en",
    skillsTeach: [] as string[],
    skillsLearn: [] as string[],
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/sign-in");
      const { data: userData } = await supabase.from("users").select("*").eq("user_id", user.id).single();
      if (userData?.onboarding_completed) return router.push("/dashboard");
      if (userData) {
        setForm(prev => ({
          ...prev,
          name: userData.name || userData.full_name || "",
          college: userData.college || "",
          language: userData.language_preference || "en",
        }));
      }
    };
    load();
  }, []);

  const awardCredits = (amount: number) => {
    setCreditsEarned(prev => prev + amount);
    setShowBonus(true);
    setTimeout(() => setShowBonus(false), 2500);
  };

  const handleComplete = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: currentUser } = await supabase.from("users").select("*").eq("user_id", user.id).single();
    let creditsToAdd = 0;
    const transactions: any[] = [];

    // Bio credit
    if (form.bio.trim().length > 0) {
      creditsToAdd += 0.5;
      transactions.push({ amount: 0.5, type: "profile", description: "Bio written (+0.5 credits)" });
    }

    // Update user profile
    await supabase.from("users").update({
      name: form.name,
      bio: form.bio,
      college: form.college,
      language_preference: form.language,
      onboarding_completed: true,
    }).eq("user_id", user.id);

    // Handle teach skills
    const { data: allSkillsData } = await supabase.from("skills").select("id, name");
    const skillMap: Record<string, string> = {};
    (allSkillsData || []).forEach((s: any) => { skillMap[s.name] = s.id; });

    for (const skill of form.skillsTeach) {
      if (skillMap[skill]) {
        await supabase.from("user_skills_teach").upsert({ user_id: user.id, skill_id: skillMap[skill], level: "intermediate" }, { onConflict: "user_id,skill_id" });
        creditsToAdd += 1;
        transactions.push({ amount: 1, type: "profile", description: `Added teach skill: ${skill} (+1 credit)` });
      }
    }

    for (const skill of form.skillsLearn) {
      if (skillMap[skill]) {
        await supabase.from("user_skills_learn").upsert({ user_id: user.id, skill_id: skillMap[skill] }, { onConflict: "user_id,skill_id" });
        creditsToAdd += 0.5;
        transactions.push({ amount: 0.5, type: "profile", description: `Added learning goal: ${skill} (+0.5 credits)` });
      }
    }

    if (creditsToAdd > 0) {
      const newBalance = (currentUser?.credit_balance ?? 2) + creditsToAdd;
      await supabase.from("users").update({ credit_balance: newBalance }).eq("user_id", user.id);
      for (const tx of transactions) {
        await supabase.from("credit_transactions").insert({ user_id: user.id, ...tx });
      }
    }

    setSaving(false);
    router.push("/dashboard");
  };

  const steps = [
    { label: "Welcome", emoji: "👋" },
    { label: "Your Bio", emoji: "✍️" },
    { label: "Teach Skills", emoji: "📚" },
    { label: "Learn Goals", emoji: "🎯" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0F1F35" }}>
      {/* Credits bonus banner */}
      {showBonus && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl animate-bounce"
          style={{ background: "linear-gradient(135deg, #1E3A5F, #38A169)", border: "1px solid rgba(56,161,105,0.5)" }}>
          <Coins className="w-5 h-5 text-[#D69E2E]" />
          <span className="text-white font-semibold">+{creditsEarned.toFixed(1)} credits so far! 🎉</span>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex flex-col items-center gap-1`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > i + 1 ? "bg-[#38A169] text-white" : step === i + 1 ? "bg-[#2B6CB0] text-white scale-110" : "bg-white/10 text-[#A0AEC0]"
                }`}>
                  {step > i + 1 ? <Check className="w-4 h-4" /> : s.emoji}
                </div>
                <span className="text-xs text-[#A0AEC0] hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 mb-5 ${step > i + 1 ? "bg-[#38A169]" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>
              Welcome to Jnana Setu!
            </h1>
            <p className="text-[#A0AEC0] mb-6 leading-relaxed">
              You've earned <span className="text-[#D69E2E] font-bold">+2 free credits</span> just for signing up! 
              Let's set up your profile to earn even more.
            </p>
            <div className="space-y-3 text-left mb-6">
              {[
                { icon: "✍️", text: "Write your bio", reward: "+0.5 credits" },
                { icon: "📚", text: "Add skills you can teach", reward: "+1 per skill" },
                { icon: "🎯", text: "Set learning goals", reward: "+0.5 each" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span className="text-sm text-[#EDF2F7]">{item.text}</span>
                  </div>
                  <span className="text-xs font-bold text-[#D69E2E] font-mono-jb">{item.reward}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Let's Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-4">
              <input
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            </div>
          </div>
        )}

        {/* Step 2: Bio */}
        {step === 2 && (
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">✍️</div>
              <h2 className="text-2xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Tell Your Story</h2>
              <p className="text-[#A0AEC0] text-sm mt-1">Write a bio to earn <span className="text-[#D69E2E] font-bold">+0.5 credits</span></p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">College / University</label>
                <input
                  value={form.college}
                  onChange={e => setForm(prev => ({ ...prev, college: e.target.value }))}
                  placeholder="e.g., IIT Bangalore, BITS Pilani"
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Bio <span className="text-[#D69E2E] text-xs">+0.5 credits</span></label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  placeholder="Tell others about yourself, your interests, and what you're looking to learn..."
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none text-sm resize-none"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Preferred Language</label>
                <div className="flex gap-2">
                  {[{ code: "en", label: "EN" }, { code: "kn", label: "ಕನ್ನಡ" }, { code: "hi", label: "हिंदी" }].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setForm(prev => ({ ...prev, language: lang.code }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${form.language === lang.code ? "bg-[#2B6CB0] text-white" : "glass-card text-[#A0AEC0] hover:text-[#EDF2F7]"}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl hover:bg-white/10 transition-colors">Back</button>
              <button
                onClick={() => { if (form.bio.trim()) awardCredits(0.5); setStep(3); }}
                className="flex-1 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl transition-colors"
              >
                {form.bio.trim() ? "Save & Earn +0.5 cr" : "Skip"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skills to teach */}
        {step === 3 && (
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📚</div>
              <h2 className="text-2xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>What Can You Teach?</h2>
              <p className="text-[#A0AEC0] text-sm mt-1">Each skill earns <span className="text-[#D69E2E] font-bold">+1 credit</span></p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => {
                    const already = form.skillsTeach.includes(skill);
                    if (!already) awardCredits(1);
                    setForm(prev => ({
                      ...prev,
                      skillsTeach: already ? prev.skillsTeach.filter(s => s !== skill) : [...prev.skillsTeach, skill],
                    }));
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    form.skillsTeach.includes(skill) ? "bg-[#38A169] text-white" : "glass-card text-[#A0AEC0] hover:text-[#EDF2F7]"
                  }`}
                >
                  {form.skillsTeach.includes(skill) && <Check className="w-3 h-3" />}
                  {skill}
                </button>
              ))}
            </div>
            {form.skillsTeach.length > 0 && (
              <div className="text-center text-sm text-[#D69E2E] font-medium mb-4">
                {form.skillsTeach.length} skills selected • +{form.skillsTeach.length} credits
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl hover:bg-white/10 transition-colors">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl transition-colors">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Learning goals */}
        {step === 4 && (
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎯</div>
              <h2 className="text-2xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>What Do You Want to Learn?</h2>
              <p className="text-[#A0AEC0] text-sm mt-1">Each goal earns <span className="text-[#D69E2E] font-bold">+0.5 credits</span></p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => {
                    const already = form.skillsLearn.includes(skill);
                    if (!already) awardCredits(0.5);
                    setForm(prev => ({
                      ...prev,
                      skillsLearn: already ? prev.skillsLearn.filter(s => s !== skill) : [...prev.skillsLearn, skill],
                    }));
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    form.skillsLearn.includes(skill) ? "bg-[#2B6CB0] text-white" : "glass-card text-[#A0AEC0] hover:text-[#EDF2F7]"
                  }`}
                >
                  {form.skillsLearn.includes(skill) && <Check className="w-3 h-3" />}
                  {skill}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl hover:bg-white/10 transition-colors">Back</button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex-1 py-3 bg-[#38A169] hover:bg-[#2F855A] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? "Saving..." : (
                  <>Complete Setup <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
