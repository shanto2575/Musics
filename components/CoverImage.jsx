import Image from "next/image";

export default function CoverImage({ src, alt = "", className = "" }) {
  const initial = (alt?.trim().charAt(0) || "V").toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 300px"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 ${className}`}
    >
      <span className="text-2xl sm:text-4xl font-bold text-white/90">
        {initial}
      </span>
    </div>
  );
}
