// Group A — own everything under components/group-a/
interface ExampleCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ExampleCard({ title, children }: ExampleCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
