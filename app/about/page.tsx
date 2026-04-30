import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BookOpen, Users, Star, Zap, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: "🤝", title: "Knowledge is Currency", desc: "We believe every student has something valuable to teach. No money should stand between you and learning." },
    { icon: "🤖", title: "AI-Powered Matching", desc: "Technology helps find the perfect skill exchange partner, making connections that would never happen by chance." },
    { icon: "🛡️", title: "Trust & Verification", desc: "Verified student badges, peer ratings, and quiz-based skill verification ensure quality exchanges." },
    { icon: "🌐", title: "Multi-Language", desc: "Built for India — supports English, Kannada, and Hindi so no student is left behind." },
  ];

  const team = [
    { name: "Team Member 1", role: "Full Stack Developer", emoji: "👨‍💻" },
    { name: "Team Member 2", role: "UI/UX Designer", emoji: "🎨" },
    { name: "Team Member 3", role: "AI/ML Engineer", emoji: "🤖" },
    { name: "Team Member 4", role: "Backend Developer", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-4 grid-texture">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2B6CB0]/40 bg-[#2B6CB0]/10 text-sm text-[#63B3ED] mb-6">
            <BookOpen className="w-4 h-4" />
            mind2i Hackathon PS-18
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#EDF2F7] mb-6" style={{ fontFamily: "Fraunces, serif" }}>
            About Jnana Setu
          </h1>
          <p className="text-xl text-[#A0AEC0] max-w-2xl mx-auto leading-relaxed">
            "Jnana Setu" means Bridge of Knowledge in Sanskrit. We built a platform where 
            India's college students can exchange skills freely — because education should have no price tag.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#EDF2F7] mb-6" style={{ fontFamily: "Fraunces, serif" }}>
                The Problem We're Solving
              </h2>
              <div className="space-y-4 text-[#A0AEC0] leading-relaxed">
                <p>
                  One student knows Python and wants to learn guitar. Another plays guitar and wants to learn Python. 
                  Both want to learn from each other but have no money for formal coaching and no platform to make it happen.
                </p>
                <p>
                  This is the story of millions of college students across India. Talented, knowledgeable, 
                  but unable to access quality peer learning because of financial barriers.
                </p>
                <p>
                  <span className="text-[#EDF2F7] font-semibold">Jnana Setu bridges that gap.</span> Every student 
                  has something valuable to teach. We make it possible to barter skills — your knowledge for theirs.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <div className="text-5xl mb-4 text-center">🎓 ⇄ 🎸</div>
              <div className="text-center mb-6">
                <div className="text-[#EDF2F7] font-semibold mb-2">A Real Exchange</div>
                <div className="text-[#A0AEC0] text-sm">Python lessons ↔ Guitar lessons</div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "✅", text: "No money required" },
                  { icon: "✅", text: "AI-powered matching" },
                  { icon: "✅", text: "Live WebRTC video sessions" },
                  { icon: "✅", text: "Credit economy system" },
                  { icon: "✅", text: "Verified student community" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#A0AEC0]">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-[#0A1628]/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
              Our Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-lg font-semibold text-[#EDF2F7] mb-2">{v.title}</h3>
                <p className="text-[#A0AEC0] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
              Built With Modern Tech
            </h2>
            <p className="text-[#A0AEC0]">PS-18 Tech Stack: Next.js · WebRTC · Node.js · MongoDB · AI</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { tech: "Next.js 14", icon: "⚡", desc: "App Router" },
              { tech: "WebRTC", icon: "📹", desc: "Live Video" },
              { tech: "Supabase", icon: "🗄️", desc: "Database" },
              { tech: "OpenAI", icon: "🤖", desc: "AI Features" },
              { tech: "Socket.io", icon: "🔌", desc: "Real-time" },
              { tech: "TypeScript", icon: "📝", desc: "Type Safety" },
              { tech: "Tailwind CSS", icon: "🎨", desc: "Styling" },
              { tech: "Stripe", icon: "💳", desc: "Payments" },
            ].map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-[#EDF2F7] text-sm">{t.tech}</div>
                <div className="text-xs text-[#A0AEC0]">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
