export default function Equalizer({ active = false, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`eq ${active ? "" : "stopped"} text-current ${className}`}
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
