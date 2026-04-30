import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Bell, Check, CheckCheck, Calendar, Coins, Users, Settings } from "lucide-react";

const mockNotifications = [
  { id: 1, type: "session", title: "Session Request Received", message: "Arjun Kumar wants to book a Python session with you", time: "2m ago", read: false },
  { id: 2, type: "credit", title: "Credits Earned!", message: "You earned +1 credit for completing a session with Priya S.", time: "1h ago", read: false },
  { id: 3, type: "match", title: "New Match Found", message: "Our AI found a 94% match for you — Rahul Nair teaches Guitar!", time: "3h ago", read: false },
  { id: 4, type: "session", title: "Session Reminder", message: "Your Python session with Arjun starts in 30 minutes", time: "29m ago", read: true },
  { id: 5, type: "system", title: "Profile Complete!", message: "You've completed 80% of your profile. Add skills to earn more credits!", time: "1d ago", read: true },
  { id: 6, type: "credit", title: "5-Star Bonus", message: "You received a 5-star rating! +0.5 bonus credits added", time: "2d ago", read: true },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  session: { icon: Calendar, color: "#63B3ED", bg: "#63B3ED20" },
  credit: { icon: Coins, color: "#D69E2E", bg: "#D69E2E20" },
  match: { icon: Users, color: "#38A169", bg: "#38A16920" },
  system: { icon: Settings, color: "#A0AEC0", bg: "#A0AEC020" },
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: dbNotifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const notifications = dbNotifications && dbNotifications.length > 0 ? dbNotifications : mockNotifications;
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-[#A0AEC0]">{unreadCount} unread notifications</p>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#A0AEC0] glass-card rounded-xl hover:bg-white/10 transition-colors">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          {["All", "Sessions", "Matches", "Credits", "System"].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-[#2B6CB0] text-white" : "text-[#A0AEC0] hover:text-[#EDF2F7]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notif: any) => {
            const cfg = typeConfig[notif.type] || typeConfig.system;
            const NotifIcon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${!notif.read ? 'glass-card border border-white/15' : 'bg-white/3 border border-white/5'}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                  <NotifIcon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className={`font-medium text-sm ${!notif.read ? 'text-[#EDF2F7]' : 'text-[#A0AEC0]'}`}>{notif.title}</div>
                      <div className="text-xs text-[#A0AEC0] mt-0.5 leading-relaxed">{notif.message}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#A0AEC0]">{notif.time}</span>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
