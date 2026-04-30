import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4" style={{ backgroundColor: "#0F1F35" }}>
        <FormMessage message={searchParams} />
      </div>
    );
  }

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
          <div className="w-14 h-14 rounded-full bg-[#2B6CB0]/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#2B6CB0]" />
          </div>
          <h1 className="text-3xl font-bold text-[#EDF2F7] mb-2" style={{ fontFamily: "Fraunces, serif" }}>Set New Password</h1>
          <p className="text-[#A0AEC0] text-sm">Enter your new password to secure your account</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form className="flex flex-col space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#EDF2F7]">New Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#EDF2F7" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#EDF2F7]">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                required
                className="w-full"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#EDF2F7" }}
              />
            </div>

            <SubmitButton
              formAction={resetPasswordAction}
              pendingText="Resetting password..."
              className="w-full py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors"
            >
              Reset Password
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>

          <div className="mt-4 text-center">
            <Link href="/sign-in" className="text-sm text-[#A0AEC0] hover:text-[#EDF2F7] transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
