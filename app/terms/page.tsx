import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>Terms & Conditions</h1>
          <p className="text-[#A0AEC0]">Last updated: January 2025 · Jnana Setu — Hackathon PS-18</p>
        </div>
        <div className="glass-card rounded-2xl p-8 space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By creating an account on Jnana Setu, you agree to be bound by these Terms and Conditions. These terms apply to all users of the platform including students who teach, students who learn, and guests browsing public pages."
            },
            {
              title: "2. Eligibility",
              content: "You must be a currently enrolled college/university student to use Jnana Setu. You must be at least 16 years of age. You must provide a valid college email address (.edu, .ac.in, or verified institutional domain) for registration. Creating multiple accounts to manipulate the credit system is strictly prohibited."
            },
            {
              title: "3. Credit System Rules",
              content: "Credits are a platform-internal currency with no real-world monetary value. You begin with 2 credits upon email verification. Credits are earned through legitimate teaching activity — attempting to game the system through fake sessions, bot accounts, or coordinated credit farming will result in immediate account suspension. Credit gifting is limited to 1 gift per user per month. Credits cannot be transferred outside the platform."
            },
            {
              title: "4. Session Conduct",
              content: "Both parties must confirm session completion for credits to transfer. Sessions must be educational in nature and relevant to the listed skill. Recording a session without the other party's explicit consent is prohibited. Any form of harassment, inappropriate content, or misconduct during sessions will result in account termination. AI-generated session notes are private to session participants."
            },
            {
              title: "5. Content & Reviews",
              content: "You may not post false, misleading, or defamatory reviews. Review bombing (coordinated negative reviews) is grounds for account suspension. Our AI automatically flags suspicious reviews for admin review. Users found to be posting fake reviews will have all their reviews removed and may face account suspension."
            },
            {
              title: "6. Intellectual Property",
              content: "Content you create on the platform (profile, session notes, reviews) remains yours. You grant Jnana Setu a license to display this content to other users for platform functionality. AI-generated session summaries are owned by Jnana Setu but made available to session participants. The Jnana Setu brand, logo, and codebase are protected intellectual property."
            },
            {
              title: "7. Limitation of Liability",
              content: "Jnana Setu is provided 'as is' without warranty. We are not responsible for the quality, accuracy, or completeness of user-taught skills. We are not liable for technical issues affecting session quality. In disputes between users, we provide mediation but final resolution is the responsibility of the users involved. Our maximum liability is limited to the credit value of the disputed session."
            },
            {
              title: "8. Termination",
              content: "We may terminate or suspend accounts that violate these terms, engage in fraudulent credit activity, harass other users, post inappropriate content, or attempt to circumvent platform security. Users may delete their accounts at any time through the settings page. Upon termination, credit balances are forfeited."
            },
            {
              title: "9. Changes to Terms",
              content: "We may update these terms with 14 days notice to registered users. Continued use of the platform after notice constitutes acceptance of new terms. Significant changes affecting credit values or core functionality will require explicit re-acceptance."
            },
            {
              title: "10. Governing Law",
              content: "These terms are governed by the laws of India. Disputes shall be resolved under the jurisdiction of courts in Bangalore, Karnataka, India. For platform-related disputes, we encourage users to use our in-platform dispute resolution mechanism before seeking legal remedy."
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
