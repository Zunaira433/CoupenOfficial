"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500",
  "bg-teal-500", "bg-cyan-500", "bg-blue-500", "bg-indigo-500",
  "bg-violet-500", "bg-fuchsia-500", "bg-pink-500", "bg-rose-500"
];

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({
  src,
  name,
  size = 64,
  expandable = false
}: {
  src?: string | null;
  name: string;
  size?: number;
  expandable?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const initial = (name.trim()[0] || "?").toUpperCase();

  const circle = src ? (
    <div
      className="relative rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shrink-0"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={`${name}'s profile photo`} fill className="object-cover" sizes={`${size}px`} />
    </div>
  ) : (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${colorForName(name)}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={`${name}'s avatar`}
    >
      {initial}
    </div>
  );

  if (!expandable || !src) {
    return circle;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="View full-size photo"
      >
        {circle}
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size profile photo"
        >
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Image src={src} alt={`${name}'s profile photo`} fill className="object-cover" sizes="400px" />
          </div>
        </div>
      )}
    </>
  );
}