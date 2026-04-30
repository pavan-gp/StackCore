import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#0F1F35" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#2B6CB0] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Jnana Setu</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-2" style={{ fontFamily: "Fraunces, serif" }}>Welcome back</h1>
          <p className="text-[#A0AEC0] text-sm">Sign in to continue your learning journey</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <form className="flex flex-col space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#EDF2F7]">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@college.edu"
                required
                className="w-full bg-white/6 border-white/12 text-[#EDF2F7] placeholder-[#A0AEC0] focus:border-[#2B6CB0]/60"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-[#EDF2F7]">Password</Label>
                <Link className="text-xs text-[#2B6CB0] hover:text-[#63B3ED] transition-colors" href="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="w-full"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#EDF2F7" }}
              />
            </div>

            <SubmitButton
              className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors"
              pendingText="Signing in..."
              formAction={signInAction}
            >
              Sign In
            </SubmitButton>

            <FormMessage message={message} />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#A0AEC0]">
              Don't have an account?{" "}
              <Link className="text-[#2B6CB0] hover:text-[#63B3ED] font-medium transition-colors" href="/sign-up">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#A0AEC0]">
            Start with <span className="text-[#D69E2E] font-semibold">+2 free credits</span> on signup
          </p>
        </div>
      </div>
    </div>
  );
}
