import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search, Shield, Ban, CheckCircle, Star } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/dashboard/admin" className="flex items-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            User Management
          </h1>
          <p className="text-[#A0AEC0]">{users?.length || 0} registered users</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-white/6 border border-white/12 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 text-sm"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">College</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Credits</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Sessions</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Rating</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Joined</th>
                  <th className="text-left p-4 text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((u: any, i: number) => (
                  <tr key={u.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2B6CB0] to-[#9F7AEA] flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {(u.name || u.full_name || u.email || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#EDF2F7]">{u.name || u.full_name || "Unknown"}</div>
                          <div className="text-xs text-[#A0AEC0]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#A0AEC0]">{u.college || "—"}</td>
                    <td className="p-4">
                      <span className="text-sm font-bold font-mono-jb text-[#D69E2E]">{(u.credit_balance ?? 0).toFixed(1)}</span>
                    </td>
                    <td className="p-4 text-sm text-[#A0AEC0]">{u.session_count || 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#D69E2E] text-[#D69E2E]" />
                        <span className="text-sm text-[#EDF2F7]">{(u.rating_average ?? 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#A0AEC0]">
                      {new Date(u.created_at || Date.now()).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-[#38A169]/20 text-[#A0AEC0] hover:text-[#38A169] transition-colors" title="Verify badge">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[#E53E3E]/20 text-[#A0AEC0] hover:text-[#E53E3E] transition-colors" title="Ban user">
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[#2B6CB0]/20 text-[#A0AEC0] hover:text-[#63B3ED] transition-colors" title="View profile">
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!users || users.length === 0) && (
              <div className="text-center py-12">
                <p className="text-[#A0AEC0]">No users found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
