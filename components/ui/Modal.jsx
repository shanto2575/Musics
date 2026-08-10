"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
  footer = null,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previous && previous.focus) previous.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`animate-pop max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl border border-white/10 bg-surface shadow-2xl outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            {title && (
              <h2 className="font-heading text-xl font-bold tracking-tight text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-zinc-400">{description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 pt-5 pb-6">{children}</div>
        {footer && <div className="px-6 pb-6">{footer}</div>}
      </div>
    </div>
  );
}