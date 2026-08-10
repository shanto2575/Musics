"use client";

export default function Tabs({ tabs, active, onChange, className = "" }) {
  return (
    <div
      role="tablist"
      aria-label="View switcher"
      className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${
              isActive
                ? "btn-gradient text-white shadow-lg shadow-purple-500/25"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}