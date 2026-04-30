import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import { BookOpen } from "lucide-react";
import SignUpForm from "./signup-form";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4">
        <FormMessage message={searchParams} />
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
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-2" style={{ fontFamily: "Fraunces, serif" }}>Create your account</h1>
          <p className="text-[#A0AEC0] text-sm">Join thousands of students learning through skill exchange</p>
        </div>

        {/* Signup bonus hint */}
        <div className="glass-card rounded-xl px-4 py-3 mb-6 border border-[#D69E2E]/20 flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <div>
            <div className="text-sm font-medium text-[#D69E2E]">Welcome Bonus</div>
            <div className="text-xs text-[#A0AEC0]">Verify your college email and get +2 free credits instantly</div>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <SignUpForm searchParams={searchParams} />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#A0AEC0]">
              Already have an account?{" "}
              <Link className="text-[#2B6CB0] hover:text-[#63B3ED] font-medium transition-colors" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#A0AEC0] mt-4">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-[#2B6CB0] hover:text-[#63B3ED]">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#2B6CB0] hover:text-[#63B3ED]">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
