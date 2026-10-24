"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  authButtonClass,
  authCardClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authTitleClass,
  mensagemDeErro,
  salvarSessao,
  type AuthResponse,
} from "@/components/auth-styles";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(mensagemDeErro(data.error, "Não foi possível entrar."));
      }

      salvarSessao(data);
      router.push("/eventos");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-10">
      <div className={authCardClass}>
        <h1 className={authTitleClass}>Bem-vindo de volta</h1>
        <p className="mb-[22px] text-slate-500">
          Entre para gerenciar seus eventos.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${authInputClass} mb-4`}
          />

          <label htmlFor="password" className={authLabelClass}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${authInputClass} mb-[22px]`}
          />

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-[10px] bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-slate-600">
          Não tem conta?{" "}
          <Link href="/cadastro" className={authLinkClass}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
