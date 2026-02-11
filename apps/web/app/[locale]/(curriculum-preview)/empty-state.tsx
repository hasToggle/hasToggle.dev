export default function EmptyState({ title }: { title: React.ReactNode }) {
  return (
    <div className="block w-full min-w-[180px] rounded-xl border-2 border-white/15 border-dashed p-12 font-semibold text-sm text-white transition-colors hover:border-sky-400/20 hover:bg-gray-700/40">
      {title}
    </div>
  );
}
