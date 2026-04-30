import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, creditCost = 1 } = await req.json();

  // Mark session as completed in the sessions table
  if (sessionId) {
    await supabase
      .from("sessions")
      .update({ status: "completed" })
      .eq("id", sessionId);
  }

  const { data: userData, error: userErr } = await supabase
    .from("users")
    .select("credit_balance")
    .eq("user_id", user.id)
    .single();

  if (userErr || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentBalance = userData.credit_balance ?? 2;
  const newBalance = Math.max(0, currentBalance - creditCost);

  // Deduct credits from learner
  const { error: updateErr } = await supabase
    .from("users")
    .update({ credit_balance: newBalance })
    .eq("user_id", user.id);

  if (updateErr) {
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
  }

  // Log the transaction
  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -creditCost,
    type: "learn",
    description: sessionId
      ? `Session completed (ID: ${sessionId})`
      : "1-on-1 session completed",
    session_id: sessionId || null,
  });

  return NextResponse.json({ success: true, newBalance });
}
