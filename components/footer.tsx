import Link from 'next/link';
import { BookOpen, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10" style={{ backgroundColor: "#0A1628" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#2B6CB0] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#EDF2F7]" style={{ fontFamily: 'Fraunces, serif' }}>Jnana Setu</span>
            </Link>
            <p className="text-sm text-[#A0AEC0] leading-relaxed">
              Bridge of Knowledge. The peer-to-peer skill barter platform for college students.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#EDF2F7] mb-4 text-sm">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Explore Skills</Link></li>
              <li><Link href="/dashboard" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/match" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Find Matches</Link></li>
              <li><Link href="/dashboard/wallet" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Credits</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#EDF2F7] mb-4 text-sm">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">About</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#EDF2F7] mb-4 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="text-sm text-[#A0AEC0] mb-4 md:mb-0">
            © {currentYear} Jnana Setu. All rights reserved. Built for mind2i Hackathon PS-18.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#A0AEC0] hover:text-[#2B6CB0] transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
