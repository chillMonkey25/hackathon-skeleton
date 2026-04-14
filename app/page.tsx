import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gray-50 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Hackathon Skeleton</h1>
        <p className="mt-2 text-gray-500">Next.js · Tailwind · Prisma · Supabase · Gemini</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Group A", href: "/group-a", color: "bg-indigo-600 hover:bg-indigo-700" },
          { label: "Group B", href: "/group-b", color: "bg-emerald-600 hover:bg-emerald-700" },
          { label: "Group C", href: "/group-c", color: "bg-rose-600 hover:bg-rose-700" },
        ].map(({ label, href, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex h-32 w-48 items-center justify-center rounded-xl text-xl font-semibold text-white shadow transition ${color}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-400">
        Each group owns their own folder — start building inside it.
      </p>
    </main>
  );
}
