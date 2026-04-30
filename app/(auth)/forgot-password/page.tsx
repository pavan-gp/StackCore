import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions";
import { BookOpen, ChevronLeft } from "lucide-react";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#0F1F35" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#2B6CB0] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#EDF2F7]" style={{ fontFamily: "Fraunces, serif" }}>Jnana Setu</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-2" style={{ fontFamily: "Fraunces, serif" }}>Reset Password</h1>
          <p className="text-[#A0AEC0] text-sm">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form className="flex flex-col space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#EDF2F7]">College Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@college.edu"
                required
                className="w-full"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#EDF2F7" }}
              />
            </div>

            <SubmitButton
              formAction={forgotPasswordAction}
              pendingText="Sending reset link..."
              className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors"
            >
              Send Reset Link
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>

          <div className="mt-6 text-center">
            <Link href="/sign-in" className="flex items-center justify-center gap-1 text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
