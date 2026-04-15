import SettingsPanel from "@/components/group-a/SettingsPanel";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-12 gap-8">
      <div className="flex w-full max-w-sm items-center justify-between">
        <Link
          href="/group-b"
          className="text-xs text-[#9B8B6E] transition hover:text-[#F5ECD7]"
        >
          orbit
        </Link>
        <h1 className="text-sm font-semibold tracking-widest text-[#F5ECD7] uppercase">settings</h1>
        <span className="w-10" />
      </div>

      <SettingsPanel />
    </main>
  );
}
