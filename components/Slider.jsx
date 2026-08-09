"use client";

import { useRef, useState } from "react";

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  ariaLabel = "Slider",
  className = "",
  step = null,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const range = max - min;
  const ratio = range === 0 ? 0 : (value - min) / range;
  const clampedRatio = Math.min(1, Math.max(0, ratio));

  function setFromClientX(clientX) {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = (clientX - rect.left) / rect.width;
    const clamped = Math.min(1, Math.max(0, t));
    let next = min + clamped * range;
    if (step) {
      next = Math.round(next / step) * step;
    }
    onChange(next);
  }

  function handlePointerDown(e) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  }

  function handleKeyDown(e) {
    const keyStep = step || range / 100;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(max, value + keyStep));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(min, value - keyStep));
    }
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value * 100) / 100}
      tabIndex={0}
      className={`group relative flex h-5 cursor-pointer touch-none items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 rounded-full ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => {
        if (dragging) setFromClientX(e.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${clampedRatio * 100}%` }}
        />
      </div>
    </div>
  );
}
