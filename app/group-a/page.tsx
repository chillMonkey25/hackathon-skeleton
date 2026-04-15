"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/group-a/OnboardingForm";

export default function OnboardingPage() {
  const router = useRouter();

  // If already onboarded, skip straight to the orbit screen
  useEffect(() => {
    if (localStorage.getItem("drift_uuid")) {
      router.replace("/group-b");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="mb-2 h-2 w-2 rounded-full bg-[#C49A3C] shadow-[0_0_12px_#C49A3C]" />
        <h1 className="text-4xl font-bold tracking-widest text-[#F5ECD7]">drift</h1>
        <p className="max-w-xs text-sm leading-relaxed text-[#9B8B6E]">
          you pass the same people every day.<br />
          they pass you too.<br />
          drift notices.
        </p>
      </div>

      <OnboardingForm />
    </main>
  );
}
