import Link from 'next/link'
import { createClient } from '../../supabase/server'
import { Button } from './ui/button'
import { BookOpen, Globe, Bell } from 'lucide-react'
import UserProfile from './user-profile'

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  return (
    <nav className="w-full border-b border-white/10 bg-[#0A1628]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" prefetch className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#2B6CB0] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-[#EDF2F7]" style={{ fontFamily: 'Fraunces, serif' }}>
            Jnana Setu
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/#how-it-works" className="text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
            How It Works
          </Link>
          <Link href="/explore" className="text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
            Explore Skills
          </Link>
          <Link href="/about" className="text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-[#A0AEC0]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E53E3E] rounded-full"></span>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-[#2B6CB0] hover:bg-[#2C5282] text-white text-sm px-4 py-2 rounded-lg transition-colors">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-[#2B6CB0] rounded-lg hover:bg-[#2C5282] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
