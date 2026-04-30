import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, rating } = await req.json();
  // rating is the learner's rating for the teacher (1-5)

  const { data: userData, error: userErr } = await supabase
    .from("users")
    .select("credit_balance, session_count, rating_average")
    .eq("user_id", user.id)
    .single();

  if (userErr || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentBalance = userData.credit_balance ?? 0;
  const sessionCount = (userData.session_count ?? 0) + 1;
  let creditsToAdd = 1; // Base teaching credit
  const transactions: { amount: number; description: string; type: string }[] = [
    { amount: 1, type: "teach", description: sessionId ? `Teaching session completed (ID: ${sessionId})` : "Teaching session completed" }
  ];

  // 5-star bonus
  if (rating === 5) {
    creditsToAdd += 0.5;
    transactions.push({ amount: 0.5, type: "bonus", description: "5-star rating bonus" });
  }

  // 5-session milestone
  if (sessionCount % 5 === 0) {
    creditsToAdd += 2;
    transactions.push({ amount: 2, type: "bonus", description: `${sessionCount}-session milestone bonus!` });
  }

  const newBalance = currentBalance + creditsToAdd;

  // Update user balance and session count
  await supabase.from("users").update({
    credit_balance: newBalance,
    session_count: sessionCount,
  }).eq("user_id", user.id);

  // Log all transactions
  for (const tx of transactions) {
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
      session_id: sessionId || null,
    });
  }

  return NextResponse.json({ success: true, newBalance, creditsAdded: creditsToAdd, sessionCount });
}
