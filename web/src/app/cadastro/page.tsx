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

async function enviar(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data: AuthResponse = await response.json();
  return { response, data };
}

export default function CadastroPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const registro = await enviar("/api/auth/register", {
        name,
        email,
        password,
      });

      if (!registro.response.ok) {
        throw new Error(
          mensagemDeErro(registro.data.error, "Não foi possível criar a conta."),
        );
      }

      const login = await enviar("/api/auth/login", { email, password });

      if (!login.response.ok) {
        throw new Error(
          mensagemDeErro(login.data.error, "Conta criada, mas não foi possível entrar."),
        );
      }

      salvarSessao(login.data);
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
        <h1 className={authTitleClass}>Crie sua conta</h1>
        <p className="mb-[22px] text-slate-500">Leva menos de um minuto.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className={authLabelClass}>
            Nome
          </label>
          <input
            id="name"
            autoComplete="name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${authInputClass} mb-3.5`}
          />

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
            className={`${authInputClass} mb-3.5`}
          />

          <div className="mb-[22px] grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className={authLabelClass}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authInputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={authLabelClass}>
                Confirmar
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={authInputClass}
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-[10px] bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-5 text-center text-slate-600">
          Já tem conta?{" "}
          <Link href="/login" className={authLinkClass}>
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}
