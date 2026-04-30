import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>Privacy Policy</h1>
          <p className="text-[#A0AEC0]">Last updated: January 2025</p>
        </div>
        <div className="glass-card rounded-2xl p-8 space-y-8">
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you provide directly: your name, college email address, profile photo, bio, skills you teach, skills you want to learn, and session history. We also collect technical data such as login timestamps, session durations, and platform usage patterns to improve our AI matching algorithms."
            },
            {
              title: "2. How We Use Your Information",
              content: "Your information is used to: (1) Power our AI skill matching engine to find compatible learning partners, (2) Calculate and maintain your credit balance, (3) Send session reminders and platform notifications, (4) Detect and prevent fraudulent credit activity, (5) Generate AI session summaries and feedback reports."
            },
            {
              title: "3. Data Sharing",
              content: "We never sell your personal data. Your profile information (name, skills, rating) is visible to other Jnana Setu users for matching purposes. Session recordings are only accessible to session participants and only with explicit consent from both parties. We may share anonymized, aggregated data for academic research with partner institutions."
            },
            {
              title: "4. Data Security",
              content: "All passwords are hashed using bcrypt with salt rounds of 12. Data is transmitted over HTTPS/TLS. Session recordings are stored encrypted on Cloudinary. We conduct regular security audits. Your college email is used only for initial verification and never shared with third parties."
            },
            {
              title: "5. Cookies",
              content: "We use essential session cookies to keep you logged in. We use analytics cookies (with your consent) to understand platform usage patterns. You can opt out of non-essential cookies in your browser settings without affecting core functionality."
            },
            {
              title: "6. Your Rights",
              content: "You have the right to: access all data we hold about you, request deletion of your account and associated data (except transaction records required for dispute resolution), export your data in JSON format, opt out of AI-generated session summaries, and update your profile information at any time."
            },
            {
              title: "7. Data Retention",
              content: "Active accounts: data retained while account is active. Deleted accounts: personal data removed within 30 days. Credit transaction records: retained for 1 year for dispute resolution. Session recordings: retained for 90 days unless explicitly saved by participants."
            },
            {
              title: "8. Contact",
              content: "For privacy concerns, data requests, or to exercise your rights, contact us at privacy@jnanasetu.in or through our Contact page. We respond to all privacy requests within 72 hours."
            },
          ].map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>{section.title}</h2>
              <p className="text-[#A0AEC0] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
