import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Zap,
  Shield,
  Award,
  ChevronRight,
  Play,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const skills = [
    { name: "Python", category: "Programming", learners: 234 },
    { name: "Guitar", category: "Music", learners: 189 },
    { name: "Web Design", category: "Design", learners: 156 },
    { name: "Data Science", category: "Programming", learners: 143 },
    { name: "Hindi", category: "Languages", learners: 128 },
    { name: "Mathematics", category: "Academics", learners: 119 },
  ];

  const steps = [
    {
      icon: "📝",
      title: "Add Your Skills",
      desc: "List skills you can teach and skills you want to learn",
    },
    {
      icon: "🤖",
      title: "AI Matching",
      desc: "Our AI finds compatible skill-swap partners for you",
    },
    {
      icon: "📅",
      title: "Book a Session",
      desc: "Schedule a 1-on-1 or group learning session",
    },
    {
      icon: "📹",
      title: "Live Video Call",
      desc: "Connect via WebRTC video with AI-powered features",
    },
    {
      icon: "⭐",
      title: "Earn Credits",
      desc: "Get rewarded for teaching, spend credits to learn",
    },
  ];

  const testimonials = [
    {
      name: "Arjun Kumar",
      college: "IIT Bangalore",
      text: "Traded Python for Guitar lessons. Best exchange ever! The AI matching found me the perfect partner.",
      rating: 5,
      skills: ["Python → Guitar"],
    },
    {
      name: "Priya Sharma",
      college: "BITS Pilani",
      text: "Finally a platform where knowledge is the currency. Taught 10 students and learned 3 new skills!",
      rating: 5,
      skills: ["Design → Spanish"],
    },
    {
      name: "Rahul Nair",
      college: "NIT Trichy",
      text: "The credit system is genius. Every session feels rewarding. Already have 15 credits from teaching!",
      rating: 5,
      skills: ["ML → Photography"],
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 grid-texture">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/30 via-transparent to-[#2B6CB0]/10 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2B6CB0]/40 bg-[#2B6CB0]/10 text-sm text-[#63B3ED]">
                <Zap className="w-3.5 h-3.5" />
                <span>AI-Powered Skill Exchange Platform</span>
              </div>

              <h1
                className="text-5xl lg:text-6xl font-bold text-[#EDF2F7] leading-tight"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Bridge of <span className="text-[#2B6CB0]">Knowledge</span>
                <br />
                No Money Required
              </h1>

              <p className="text-lg text-[#A0AEC0] leading-relaxed max-w-lg">
                Trade skills with fellow students. Teach what you know, learn
                what you want. Every session earns credits — your knowledge is
                your currency.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={user ? "/dashboard" : "/sign-up"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Start Learning Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 glass-card text-[#EDF2F7] font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <Play className="w-4 h-4" />
                  Explore Skills
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-[#EDF2F7] font-mono-jb">
                    2,400+
                  </div>
                  <div className="text-sm text-[#A0AEC0]">Active Students</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-[#EDF2F7] font-mono-jb">
                    8,900+
                  </div>
                  <div className="text-sm text-[#A0AEC0]">
                    Sessions Completed
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-[#EDF2F7] font-mono-jb">
                    150+
                  </div>
                  <div className="text-sm text-[#A0AEC0]">Skills Available</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Center orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-[#2B6CB0]/30 border-2 border-[#2B6CB0]/60 flex items-center justify-center animate-pulse-glow">
                    <BookOpen className="w-12 h-12 text-[#2B6CB0]" />
                  </div>
                </div>
                {/* Orbiting skill cards */}
                {[
                  { skill: "Python", emoji: "🐍", angle: 0 },
                  { skill: "Guitar", emoji: "🎸", angle: 72 },
                  { skill: "Design", emoji: "🎨", angle: 144 },
                  { skill: "Maths", emoji: "📐", angle: 216 },
                  { skill: "Hindi", emoji: "🗣️", angle: 288 },
                ].map(({ skill, emoji, angle }, i) => {
                  const rad = (angle - 90) * (Math.PI / 180);
                  const r = 150;
                  const x = 50 + (r / 2) * Math.cos(rad);
                  const y = 50 + (r / 2) * Math.sin(rad);
                  return (
                    <div
                      key={skill}
                      className="absolute glass-card rounded-xl px-3 py-2 flex items-center gap-2 text-sm text-[#EDF2F7] animate-float"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                        animationDelay: `${i * 0.6}s`,
                      }}
                    >
                      <span>{emoji}</span>
                      <span className="font-medium">{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-24 px-4" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#EDF2F7] mb-4"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              How Jnana Setu Works
            </h2>
            <p className="text-[#A0AEC0] max-w-2xl mx-auto">
              Five simple steps from listing your skills to earning credits and
              growing your knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 relative">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-3xl mb-4 border border-[#2B6CB0]/30">
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute top-6 -right-2 text-[#2B6CB0]/40 hidden md:block w-4 h-4" />
                )}
                <div className="text-xs font-medium text-[#2B6CB0] mb-1">
                  Step {i + 1}
                </div>
                <h3 className="font-semibold text-[#EDF2F7] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#A0AEC0] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Popular Skills */}
      <section className="py-24 px-4 bg-[#0A1628]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2
                className="text-4xl font-bold text-[#EDF2F7] mb-2"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Popular Skills
              </h2>
              <p className="text-[#A0AEC0]">
                Trending skills among students right now
              </p>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-[#2B6CB0] hover:text-[#63B3ED] text-sm font-medium transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <Link
                key={skill.name}
                href="/explore"
                className="glass-card rounded-xl p-5 hover:bg-white/10 transition-all duration-200 hover:scale-105 group animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#2B6CB0]/20 text-[#63B3ED] border border-[#2B6CB0]/30">
                    {skill.category}
                  </span>
                  <Users className="w-4 h-4 text-[#A0AEC0]" />
                </div>
                <h3 className="text-lg font-semibold text-[#EDF2F7] mb-1">
                  {skill.name}
                </h3>
                <p className="text-sm text-[#A0AEC0]">
                  {skill.learners} learners
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#EDF2F7] mb-4"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Built for Students, By Students
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6 text-[#D69E2E]" />,
                title: "AI-Powered Matching",
                desc: "Our smart algorithm finds the perfect skill-swap partner based on compatibility, availability, and learning goals.",
                color: "#D69E2E",
              },
              {
                icon: <Shield className="w-6 h-6 text-[#38A169]" />,
                title: "Credit Economy",
                desc: "Earn credits by teaching, spend them to learn. Start with 2 free credits on signup. No money needed.",
                color: "#38A169",
              },
              {
                icon: <Award className="w-6 h-6 text-[#2B6CB0]" />,
                title: "Verified Badges",
                desc: "Build trust with skill verification quizzes, student badges, and peer ratings. Your reputation matters.",
                color: "#2B6CB0",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{
                    backgroundColor: `${f.color}20`,
                    border: `1px solid ${f.color}40`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#EDF2F7] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#A0AEC0] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 px-4 bg-[#0A1628]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#EDF2F7] mb-4"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              What Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-[#D69E2E] text-[#D69E2E]"
                    />
                  ))}
                </div>
                <p className="text-[#A0AEC0] text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#EDF2F7] text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-[#A0AEC0]">{t.college}</div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-[#2B6CB0]/20 text-[#63B3ED] border border-[#2B6CB0]/30">
                    {t.skills[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Credit System Highlight */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card rounded-3xl p-10 text-center border border-[#D69E2E]/20">
            <div className="text-5xl mb-4">⚡</div>
            <h2
              className="text-4xl font-bold text-[#EDF2F7] mb-4"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Start with <span className="text-[#D69E2E]">2 Free Credits</span>
            </h2>
            <p className="text-[#A0AEC0] mb-8 max-w-lg mx-auto">
              Verify your college email, get 2 credits instantly. Each session
              you teach earns more. No subscription, no payment — just pure
              knowledge exchange.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D69E2E] font-mono-jb">
                  +2
                </div>
                <div className="text-xs text-[#A0AEC0]">Sign Up Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#38A169] font-mono-jb">
                  +1
                </div>
                <div className="text-xs text-[#A0AEC0]">Per Session Taught</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2B6CB0] font-mono-jb">
                  -1
                </div>
                <div className="text-xs text-[#A0AEC0]">
                  Per Session Learned
                </div>
              </div>
            </div>
            <Link
              href={user ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Join Jnana Setu Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
