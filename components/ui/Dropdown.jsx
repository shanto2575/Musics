"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  align = "left",
  widthClass = "w-56",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${
          open
            ? "border-purple-400/40 bg-white/5 text-white"
            : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white"
        }`}
      >
        <span className="text-zinc-500">{label}</span>
        <span className="font-semibold text-white">{selected?.label}</span>
        <ChevronDown
          size={14}
          className={`transition duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`animate-pop absolute z-40 mt-2 ${widthClass} overflow-hidden rounded-2xl border border-white/10 bg-surface p-1.5 shadow-2xl shadow-black/50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-sm transition ${
                  isActive
                    ? "btn-gradient font-semibold text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {option.label}
                {option.icon}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}