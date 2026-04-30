"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#E53E3E" };
  if (score <= 2) return { score, label: "Fair", color: "#D69E2E" };
  if (score <= 3) return { score, label: "Good", color: "#63B3ED" };
  if (score <= 4) return { score, label: "Strong", color: "#38A169" };
  return { score, label: "Very Strong", color: "#38A169" };
}

export default function SignUpForm({ searchParams }: { searchParams: any }) {
  const [password, setPassword] = useState("");
  const strength = password.length > 0 ? getPasswordStrength(password) : null;

  return (
    <form className="flex flex-col space-y-5">
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-sm font-medium text-[#EDF2F7]">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Arjun Kumar"
          required
          className="w-full"
          style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#EDF2F7" }}
        />
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-[#EDF2F7]">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Min. 6 characters"
          minLength={6}
          required
          className="w-full"
          style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#EDF2F7" }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {/* Password Strength Meter */}
        {strength && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: i <= strength.score ? strength.color : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: strength.color }}>
              Password strength: <strong>{strength.label}</strong>
              {strength.score < 3 && " — add uppercase, numbers, or symbols"}
            </p>
          </div>
        )}
      </div>

      <SubmitButton
        formAction={signUpAction}
        pendingText="Creating account..."
        className="w-full py-3 bg-[#38A169] hover:bg-[#2F855A] text-white font-medium rounded-xl transition-colors"
      >
        Create Free Account
      </SubmitButton>

      <FormMessage message={searchParams} />
    </form>
  );
}
