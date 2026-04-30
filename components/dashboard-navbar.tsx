'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { BookOpen, UserCircle, LogOut, User, Wallet, Bell, Award, Shield } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Home', exact: true },
  { href: '/dashboard/match', label: 'Match' },
  { href: '/dashboard/sessions', label: 'Sessions' },
  { href: '/dashboard/wallet', label: 'Wallet' },
  { href: '/dashboard/messages', label: 'Messages' },
]

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [unreadNotifs, setUnreadNotifs] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: userData } = await supabase.from('users').select('credit_balance').eq('user_id', user.id).single()
      if (userData) setCreditBalance(userData.credit_balance ?? 2)
      const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false)
      setUnreadNotifs(count || 0)
    }
    fetchData()
  }, [pathname])

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="w-full border-b border-white/10 sticky top-0 z-50" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10,22,40,0.95)' }}>
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-6">
          <Link href="/" prefetch className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2B6CB0] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#EDF2F7]" style={{ fontFamily: 'Fraunces, serif' }}>
              Jnana Setu
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'bg-[#2B6CB0]/20 text-[#63B3ED]'
                    : 'text-[#A0AEC0] hover:text-[#EDF2F7] hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Credits chip */}
          {creditBalance !== null && (
            <Link
              href="/dashboard/wallet"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono-jb transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(214,158,46,0.12)', border: '1px solid rgba(214,158,46,0.35)', color: '#D69E2E' }}
            >
              ⚡ {creditBalance.toFixed(1)} cr
            </Link>
          )}

          {/* Notifications bell */}
          <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-[#A0AEC0]" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E53E3E] rounded-full text-white text-xs flex items-center justify-center font-bold leading-none">
                {unreadNotifs > 9 ? '9+' : unreadNotifs}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#A0AEC0] hover:text-[#EDF2F7] hover:bg-white/10">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0F1F35] border-white/10 text-[#EDF2F7] w-48">
              <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                <Link href="/dashboard/wallet">
                  <Wallet className="mr-2 h-4 w-4" /> Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                <Link href="/dashboard/badges">
                  <Award className="mr-2 h-4 w-4" /> Badges
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                <Link href="/dashboard/admin">
                  <Shield className="mr-2 h-4 w-4" /> Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="hover:bg-white/10 cursor-pointer text-[#E53E3E]"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
