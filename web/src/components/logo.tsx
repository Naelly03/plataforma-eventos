import { useId } from "react";

type LogoIconProps = {
  size?: number;
  className?: string;
};

export function LogoIcon({ size = 34, className }: LogoIconProps) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`block flex-none ${className ?? ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c2410c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="34" fill={`url(#${gradientId})`} />
      <rect
        x="30"
        y="38"
        width="60"
        height="54"
        rx="12"
        fill="none"
        stroke="#fff"
        strokeWidth="8"
      />
      <path d="M30 58H90" stroke="#fff" strokeWidth="8" />
      <path
        d="M48 28V44M72 28V44"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M47 76l9 9 17-17"
        fill="none"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoIcon />
      <span className="text-xl font-extrabold tracking-tight">Agendou</span>
    </span>
  );
}
