import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import SessionsClient from "./sessions-client";

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  const allSessions = sessions && sessions.length > 0
    ? sessions.map((s: any) => ({
        ...s,
        role: s.teacher_id === user.id ? 'teacher' : 'learner',
      }))
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <SessionsClient sessions={allSessions} />
    </div>
  );
}
