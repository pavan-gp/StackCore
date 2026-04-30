import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, MessageSquare, Phone, MapPin, ChevronDown } from "lucide-react";

const faqs = [
  { q: "How do I earn my first credits?", a: "Sign up and verify your college email to receive +2 free credits instantly. You can earn more by completing your profile (bio +0.5, skills +1 each) and teaching sessions (+1 per session)." },
  { q: "Can I use Jnana Setu without teaching?", a: "You start with 2 free credits which let you book 2 learning sessions. After that, you'll need to teach to earn more credits. This ensures the platform stays balanced." },
  { q: "Is the video call recorded?", a: "Sessions are only recorded with explicit consent from both parties. Recordings are stored securely on Cloudinary and accessible only to session participants." },
  { q: "How does AI matching work?", a: "Our AI analyzes your skills offered, skills wanted, availability windows, rating history, and language preference to calculate a compatibility score (%) for each potential partner." },
  { q: "What happens if a partner doesn't show up?", a: "Both parties must confirm session completion for credits to transfer. If a partner doesn't show, no credits are deducted. You can report no-shows to our admin team." },
  { q: "Is Jnana Setu free?", a: "Completely free! No subscription, no payment required. The credit system is entirely peer-to-peer — your knowledge is your currency." },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
            Get in Touch
          </h1>
          <p className="text-[#A0AEC0] text-lg">Have questions, feedback, or want to partner with us? We'd love to hear from you.</p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 pb-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#EDF2F7] mb-6" style={{ fontFamily: "Fraunces, serif" }}>Send a Message</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#EDF2F7] mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Arjun"
                    className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Kumar"
                    className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">College Email</label>
                <input
                  type="email"
                  placeholder="you@college.edu"
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Subject</label>
                <select
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm appearance-none cursor-pointer"
                  style={{ background: "rgba(15,31,53,0.95)", borderColor: "rgba(255,255,255,0.12)" }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Report a Bug</option>
                  <option value="partnership">College Partnership</option>
                  <option value="feedback">Feature Feedback</option>
                  <option value="abuse">Report Abuse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EDF2F7] mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors text-sm resize-none"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#EDF2F7] mb-5" style={{ fontFamily: "Fraunces, serif" }}>Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "hello@jnanasetu.in", color: "#2B6CB0" },
                  { icon: <MessageSquare className="w-5 h-5" />, label: "Discord", value: "discord.gg/jnanasetu", color: "#9F7AEA" },
                  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+91 98765 43210", color: "#38A169" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Bangalore, Karnataka, India", color: "#D69E2E" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs text-[#A0AEC0]">{item.label}</div>
                      <div className="text-sm font-medium text-[#EDF2F7]">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>Follow Us</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Twitter/X", handle: "@JnanaSetu", emoji: "𝕏", color: "#EDF2F7" },
                  { name: "LinkedIn", handle: "Jnana Setu", emoji: "in", color: "#0A66C2" },
                  { name: "Instagram", handle: "@jnanasetu", emoji: "📸", color: "#E1306C" },
                  { name: "GitHub", handle: "jnanasetu", emoji: "⚙️", color: "#A0AEC0" },
                ].map((social, i) => (
                  <a key={i} href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold" style={{ color: social.color }}>
                      {social.emoji}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#EDF2F7]">{social.name}</div>
                      <div className="text-xs text-[#A0AEC0]">{social.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-card rounded-2xl p-6 border border-[#38A169]/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#38A169] animate-pulse" />
                <div>
                  <div className="text-sm font-medium text-[#EDF2F7]">Usually respond within 24 hours</div>
                  <div className="text-xs text-[#A0AEC0]">Mon–Fri, 9 AM – 6 PM IST</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-[#EDF2F7] mb-8 text-center" style={{ fontFamily: "Fraunces, serif" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <details key={i} className="glass-card rounded-2xl group">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-[#EDF2F7] font-medium list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-[#A0AEC0] transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-sm text-[#A0AEC0] leading-relaxed border-t border-white/10 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
