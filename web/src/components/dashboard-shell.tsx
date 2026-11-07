"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { limparSessao, useSessao } from "@/lib/session";

const rotasPublicas = ["/login", "/cadastro"];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { pronto, token } = useSessao();

  const rotaPublica = rotasPublicas.includes(pathname);
  const semSessao = pronto && !token;

  // Rotas internas exigem sessão; sem token (ou com o token expirado, que a
  // API faz limpar em um 401) o usuário volta para o login.
  useEffect(() => {
    if (!rotaPublica && semSessao) router.replace("/login");
  }, [rotaPublica, semSessao, router]);

  function handleLogout() {
    limparSessao();
    router.push("/login");
  }

  if (rotaPublica) {
    return <div className="flex min-h-screen flex-col">{children}</div>;
  }

  if (!pronto || !token) {
    return <div className="min-h-screen" aria-busy="true" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
        <Link href="/eventos" className="type-h3">
          Agendou
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 type-button text-slate-700 hover:bg-slate-100"
        >
          Sair
        </button>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
