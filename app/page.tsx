import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-widest text-[#F5ECD7]">drift</h1>
        <p className="mt-3 text-sm tracking-wide text-[#9B8B6E]">
          you keep crossing paths with strangers who might not be strangers for long
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/group-a"
          className="flex flex-col gap-1 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] px-6 py-4 transition hover:border-[#C49A3C] hover:bg-[#1A1228]"
        >
          <span className="text-xs font-medium tracking-widest text-[#C49A3C] uppercase">Group A</span>
          <span className="text-base font-semibold text-[#F5ECD7]">Onboarding + Identity</span>
          <span className="text-xs text-[#6B5D4F]">Display name, UUID, settings</span>
        </Link>

        <Link
          href="/group-b"
          className="flex flex-col gap-1 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] px-6 py-4 transition hover:border-[#8B5CF6] hover:bg-[#1A1228]"
        >
          <span className="text-xs font-medium tracking-widest text-[#8B5CF6] uppercase">Group B</span>
          <span className="text-base font-semibold text-[#F5ECD7]">Orbit Screen</span>
          <span className="text-xs text-[#6B5D4F]">Familiar strangers, encounter history</span>
        </Link>

        <Link
          href="/group-c"
          className="flex flex-col gap-1 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] px-6 py-4 transition hover:border-[#C49A3C] hover:bg-[#1A1228]"
        >
          <span className="text-xs font-medium tracking-widest text-[#C49A3C] uppercase">Group C</span>
          <span className="text-base font-semibold text-[#F5ECD7]">Chat + Reveal</span>
          <span className="text-xs text-[#6B5D4F]">Anonymous chat, mutual reveal, icebreaker</span>
        </Link>
      </div>
    </main>
  );
}
