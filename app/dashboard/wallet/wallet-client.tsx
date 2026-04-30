"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Gift, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";

const txTypeConfig: Record<string, { color: string; bg: string; icon: any }> = {
  earned: { color: "#38A169", bg: "#38A16920", icon: TrendingUp },
  teach: { color: "#38A169", bg: "#38A16920", icon: TrendingUp },
  learn: { color: "#63B3ED", bg: "#63B3ED20", icon: TrendingDown },
  spent: { color: "#63B3ED", bg: "#63B3ED20", icon: TrendingDown },
  bonus: { color: "#D69E2E", bg: "#D69E2E20", icon: Award },
  gift: { color: "#9F7AEA", bg: "#9F7AEA20", icon: Gift },
  signup: { color: "#38A169", bg: "#38A16920", icon: TrendingUp },
};

type FilterTab = "All" | "Earned" | "Spent" | "Bonus";
const filterTabs: FilterTab[] = ["All", "Earned", "Spent", "Bonus"];

export default function WalletClient({
  transactions,
  earned,
  spent,
}: {
  transactions: any[];
  earned: number;
  spent: number;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredTx = transactions.filter((tx) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Earned") return tx.amount > 0 && tx.type !== "bonus";
    if (activeFilter === "Spent") return tx.amount < 0;
    if (activeFilter === "Bonus") return tx.type === "bonus";
    return true;
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-lg font-semibold text-[#EDF2F7]"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Transaction History
        </h2>
        <div className="flex gap-2">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                activeFilter === f
                  ? "bg-[#2B6CB0] text-white"
                  : "text-[#A0AEC0] hover:text-[#EDF2F7] hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTx.length === 0 && (
          <div className="text-center py-8 text-[#A0AEC0] text-sm">
            No {activeFilter.toLowerCase()} transactions yet.
          </div>
        )}
        {filteredTx.map((tx: any) => {
          const txCfg = txTypeConfig[tx.type] || txTypeConfig.earned;
          const TxIcon = txCfg.icon;
          return (
            <div
              key={tx.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: txCfg.bg }}
              >
                <TxIcon className="w-4 h-4" style={{ color: txCfg.color }} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#EDF2F7] font-medium">{tx.description}</div>
                <div className="text-xs text-[#A0AEC0]">
                  {new Date(tx.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div
                className={`text-base font-bold font-mono-jb ${
                  tx.amount > 0 ? "text-[#38A169]" : "text-[#E53E3E]"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
