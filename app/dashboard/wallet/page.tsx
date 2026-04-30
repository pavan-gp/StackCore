import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";
import WalletClient from "./wallet-client";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: userData } = await supabase.from('users').select('*').eq('user_id', user.id).single();
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const creditBalance = userData?.credit_balance ?? 2;
  const allTx = transactions || [];

  const earned = allTx.filter(t => t.amount > 0).reduce((s: number, t: any) => s + t.amount, 0);
  const spent = Math.abs(allTx.filter(t => t.amount < 0).reduce((s: number, t: any) => s + t.amount, 0));

  const displayTx = allTx;

  const creditEarnGuide = [
    { phase: "Sign Up", action: "College email OTP verified", credits: "+2" },
    { phase: "Profile", action: "Add teachable skill", credits: "+1 each" },
    { phase: "Profile", action: "Write bio", credits: "+0.5" },
    { phase: "Profile", action: "Upload photo", credits: "+0.5" },
    { phase: "Profile", action: "Add learning goal", credits: "+0.5" },
    { phase: "Profile", action: "Pass skill quiz", credits: "+1" },
    { phase: "Teaching", action: "Complete + rated session", credits: "+1" },
    { phase: "Teaching", action: "5-star rating bonus", credits: "+0.5" },
    { phase: "Milestone", action: "Complete 5 sessions", credits: "+2" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            Wallet & Credits
          </h1>
          <p className="text-[#A0AEC0]">Your knowledge economy dashboard</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Credit Balance */}
          <div className="lg:col-span-1 rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2B6CB0 100%)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-200">Total Balance</span>
              <Coins className="w-5 h-5 text-[#D69E2E]" />
            </div>
            <div className="text-6xl font-bold text-white font-mono-jb mb-1 animate-count-up">
              {creditBalance.toFixed(1)}
            </div>
            <div className="text-sm text-blue-200 mb-6">credits</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <ArrowUpRight className="w-3 h-3 text-[#38A169]" />
                  <span className="text-xs text-blue-200">Earned</span>
                </div>
                <div className="text-lg font-bold text-[#38A169] font-mono-jb">{earned.toFixed(1)}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <ArrowDownRight className="w-3 h-3 text-[#E53E3E]" />
                  <span className="text-xs text-blue-200">Spent</span>
                </div>
                <div className="text-lg font-bold text-[#E53E3E] font-mono-jb">{spent.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Earn Guide */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
              How to Earn Credits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {creditEarnGuide.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: item.phase === "Sign Up" ? "#38A16920" : item.phase === "Teaching" ? "#2B6CB020" : item.phase === "Milestone" ? "#D69E2E20" : "#9F7AEA20",
                      color: item.phase === "Sign Up" ? "#38A169" : item.phase === "Teaching" ? "#63B3ED" : item.phase === "Milestone" ? "#D69E2E" : "#B794F4",
                    }}>
                      {item.phase}
                    </span>
                    <span className="text-xs text-[#A0AEC0]">{item.action}</span>
                  </div>
                  <span className="text-sm font-bold text-[#D69E2E] font-mono-jb shrink-0">{item.credits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <WalletClient transactions={displayTx} earned={earned} spent={spent} />
      </main>
    </div>
  );
}
