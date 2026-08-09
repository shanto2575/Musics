export default function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-elevated p-5 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">{label}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            accent || "bg-purple-500/10 text-purple-300"
          }`}
        >
          <Icon size={20} />
        </span>
      </div>
      <p className="font-heading mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}
