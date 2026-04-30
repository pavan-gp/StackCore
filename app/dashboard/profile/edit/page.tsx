"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { useState, useEffect } from "react";
import { createClient } from "../../../../../supabase/client";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, Coins } from "lucide-react";
import Link from "next/link";

const allSkills = ["Python", "JavaScript", "React", "Guitar", "Piano", "Web Design", "UI/UX", "Figma", "Data Science", "Machine Learning", "Java", "C++", "Photography", "Video Editing", "Marketing", "Finance", "Public Speaking", "Mathematics", "Physics", "English Speaking", "Kannada", "Hindi", "Spanish"];

export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    college: "",
    language: "en",
    skillsTeach: [] as string[],
    skillsLearn: [] as string[],
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/sign-in");
      const { data } = await supabase.from('users').select('*').eq('user_id', user.id).single();
      if (data) {
        setExistingData(data);
        setForm(prev => ({
          ...prev,
          name: data.name || data.full_name || "",
          bio: data.bio || "",
          college: data.college || "",
          language: data.language_preference || "en",
        }));
      }
      // Load existing skills
      const { data: teachSkills } = await supabase
        .from('user_skills_teach')
        .select('skills(name)')
        .eq('user_id', user.id);
      const { data: learnSkills } = await supabase
        .from('user_skills_learn')
        .select('skills(name)')
        .eq('user_id', user.id);
      if (teachSkills) {
        setForm(prev => ({ ...prev, skillsTeach: teachSkills.map((s: any) => s.skills?.name).filter(Boolean) }));
      }
      if (learnSkills) {
        setForm(prev => ({ ...prev, skillsLearn: learnSkills.map((s: any) => s.skills?.name).filter(Boolean) }));
      }
    };
    loadUser();
  }, []);

  const toggleSkill = (skill: string, list: 'teach' | 'learn') => {
    const key = list === 'teach' ? 'skillsTeach' : 'skillsLearn';
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(skill)
        ? prev[key].filter(s => s !== skill)
        : [...prev[key], skill],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let creditsToAdd = 0;
    const transactions: { amount: number; type: string; description: string }[] = [];

    // Fetch current user data fresh
    const { data: currentUser } = await supabase.from('users').select('*').eq('user_id', user.id).single();

    // Award +0.5 for bio if newly written
    const hadBio = !!(existingData?.bio);
    const hasBio = form.bio.trim().length > 0;
    if (!hadBio && hasBio) {
      creditsToAdd += 0.5;
      transactions.push({ amount: 0.5, type: 'profile', description: 'Bio written (+0.5 credits)' });
    }

    // Update basic profile info
    await supabase.from('users').update({
      name: form.name,
      bio: form.bio,
      college: form.college,
      language_preference: form.language,
    }).eq('user_id', user.id);

    // Handle teach skills — award +1 per NEW skill added
    const { data: allSkillsData } = await supabase.from('skills').select('id, name');
    const skillMap: Record<string, string> = {};
    (allSkillsData || []).forEach((s: any) => { skillMap[s.name] = s.id; });

    const { data: existingTeach } = await supabase
      .from('user_skills_teach')
      .select('skills(name)')
      .eq('user_id', user.id);
    const existingTeachNames = (existingTeach || []).map((s: any) => s.skills?.name).filter(Boolean);

    for (const skill of form.skillsTeach) {
      if (!existingTeachNames.includes(skill) && skillMap[skill]) {
        await supabase.from('user_skills_teach').upsert({
          user_id: user.id,
          skill_id: skillMap[skill],
          level: 'intermediate',
        }, { onConflict: 'user_id,skill_id' });
        creditsToAdd += 1;
        transactions.push({ amount: 1, type: 'profile', description: `Added teach skill: ${skill} (+1 credit)` });
      } else if (skillMap[skill]) {
        await supabase.from('user_skills_teach').upsert({
          user_id: user.id,
          skill_id: skillMap[skill],
          level: 'intermediate',
        }, { onConflict: 'user_id,skill_id' });
      }
    }
    // Remove deselected teach skills
    for (const skill of existingTeachNames) {
      if (!form.skillsTeach.includes(skill) && skillMap[skill]) {
        await supabase.from('user_skills_teach').delete()
          .eq('user_id', user.id).eq('skill_id', skillMap[skill]);
      }
    }

    // Handle learn skills — award +0.5 per NEW skill added
    const { data: existingLearn } = await supabase
      .from('user_skills_learn')
      .select('skills(name)')
      .eq('user_id', user.id);
    const existingLearnNames = (existingLearn || []).map((s: any) => s.skills?.name).filter(Boolean);

    for (const skill of form.skillsLearn) {
      if (!existingLearnNames.includes(skill) && skillMap[skill]) {
        await supabase.from('user_skills_learn').upsert({
          user_id: user.id,
          skill_id: skillMap[skill],
        }, { onConflict: 'user_id,skill_id' });
        creditsToAdd += 0.5;
        transactions.push({ amount: 0.5, type: 'profile', description: `Added learning goal: ${skill} (+0.5 credits)` });
      } else if (skillMap[skill]) {
        await supabase.from('user_skills_learn').upsert({
          user_id: user.id,
          skill_id: skillMap[skill],
        }, { onConflict: 'user_id,skill_id' });
      }
    }
    // Remove deselected learn skills
    for (const skill of existingLearnNames) {
      if (!form.skillsLearn.includes(skill) && skillMap[skill]) {
        await supabase.from('user_skills_learn').delete()
          .eq('user_id', user.id).eq('skill_id', skillMap[skill]);
      }
    }

    // Apply credits if any earned
    if (creditsToAdd > 0) {
      const newBalance = (currentUser?.credit_balance ?? 2) + creditsToAdd;
      await supabase.from('users').update({ credit_balance: newBalance }).eq('user_id', user.id);
      // Log each transaction
      for (const tx of transactions) {
        await supabase.from('credit_transactions').insert({
          user_id: user.id,
          amount: tx.amount,
          type: tx.type,
          description: tx.description,
        });
      }
      setCreditsEarned(creditsToAdd);
      setShowSuccess(true);
      setSaving(false);
      setTimeout(() => router.push('/dashboard/profile'), 2000);
    } else {
      setSaving(false);
      router.push('/dashboard/profile');
    }
  };

  const steps = ["Basic Info", "Skills to Teach", "Skills to Learn", "Done"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />

      {/* Credits Earned Success Banner */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl animate-bounce"
          style={{ background: "linear-gradient(135deg, #1E3A5F, #38A169)", border: "1px solid rgba(56,161,105,0.5)" }}>
          <Coins className="w-5 h-5 text-[#D69E2E]" />
          <span className="text-white font-semibold">+{creditsEarned.toFixed(1)} credits earned! 🎉</span>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link href="/dashboard/profile" className="flex items-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Edit Profile</h1>
        </div>

        {/* Steps */}
        <div className="flex gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-[#38A169] text-white' : step === i + 1 ? 'bg-[#2B6CB0] text-white' : 'bg-white/10 text-[#A0AEC0]'
                }`}>
                  {step > i + 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-xs text-[#A0AEC0] hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${step > i + 1 ? 'bg-[#38A169]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Bio <span className="text-[#D69E2E] text-xs">+0.5 credits</span></label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm resize-none"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  placeholder="Tell others about yourself, your interests, and what you're looking to learn..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">College / University</label>
                <input
                  value={form.college}
                  onChange={e => setForm(prev => ({ ...prev, college: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  placeholder="e.g., IIT Bangalore, BITS Pilani"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Preferred Language</label>
                <div className="flex gap-2">
                  {[{ code: 'en', label: 'EN' }, { code: 'kn', label: 'ಕನ್ನಡ' }, { code: 'hi', label: 'हिंदी' }].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setForm(prev => ({ ...prev, language: lang.code }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${form.language === lang.code ? 'bg-[#2B6CB0] text-white' : 'glass-card text-[#A0AEC0] hover:text-[#EDF2F7]'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-2">Skills You Can Teach</h2>
              <p className="text-xs text-[#A0AEC0] mb-4">Each skill earns you <span className="text-[#D69E2E]">+1 credit</span></p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill, 'teach')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      form.skillsTeach.includes(skill)
                        ? 'bg-[#38A169] text-white'
                        : 'glass-card text-[#A0AEC0] hover:text-[#EDF2F7]'
                    }`}
                  >
                    {form.skillsTeach.includes(skill) && <Check className="w-3 h-3" />}
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl hover:bg-white/10 transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-xl transition-colors">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-[#EDF2F7] mb-2">Skills You Want to Learn</h2>
              <p className="text-xs text-[#A0AEC0] mb-4">Each learning goal earns you <span className="text-[#D69E2E]">+0.5 credits</span></p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill, 'learn')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      form.skillsLearn.includes(skill)
                        ? 'bg-[#2B6CB0] text-white'
                        : 'glass-card text-[#A0AEC0] hover:text-[#EDF2F7]'
                    }`}
                  >
                    {form.skillsLearn.includes(skill) && <Check className="w-3 h-3" />}
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 glass-card text-[#EDF2F7] rounded-xl hover:bg-white/10 transition-colors">Back</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#38A169] hover:bg-[#2F855A] text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
