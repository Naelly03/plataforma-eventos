"use client";

import { useState } from "react";
import { authInputClass } from "@/components/auth-styles";

type CampoSenhaProps = {
  id: string;
  value: string;
  onChange: (valor: string) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  // espaço abaixo do campo (classe de margem do Tailwind)
  className?: string;
};

// Campo de senha com o olhinho para mostrar ou esconder o texto
export default function CampoSenha({
  id,
  value,
  onChange,
  autoComplete,
  minLength,
  className = "",
}: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={visivel ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${authInputClass} pr-11`}
      />

      <button
        type="button"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-[10px] text-slate-500 transition hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-orange-600"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {visivel ? (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <path d="M1 1l22 22" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
