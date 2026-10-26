"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { limparSessao, useSessao } from "@/lib/session";

const rotasPublicas = ["/", "/login", "/cadastro"];

const menuItems = [
  { label: "Eventos", href: "/eventos" },
];

const headerClass =
  "sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-8";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { pronto, token, user } = useSessao();

  const rotaPublica = rotasPublicas.includes(pathname);
  const semSessao = pronto && !token;

  // Rotas internas exigem sessão; sem token (ou com o token expirado, que a
  // API faz limpar em um 401) o usuário volta para o login.
  useEffect(() => {
    if (!rotaPublica && semSessao) router.replace("/login");
  }, [rotaPublica, semSessao, router]);

  function handleLogout() {
    limparSessao();
    router.push("/");
  }

  if (!rotaPublica && (!pronto || !token)) {
    return <div className="min-h-screen" aria-busy="true" />;
  }

  if (rotaPublica) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className={headerClass}>
          <Link href="/" aria-label="Agendou, página inicial">
            <Logo />
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-[10px] px-4 py-2.5 type-button text-slate-700 transition hover:bg-slate-100"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-[10px] bg-linear-to-r from-orange-700 to-orange-600 px-[18px] py-2.5 type-button text-white shadow-[0_4px_14px_rgba(194,65,12,0.28)] transition hover:brightness-110"
            >
              Criar conta
            </Link>
          </nav>
        </header>

        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className={headerClass}>
        <Link href="/eventos" aria-label="Agendou, eventos">
          <Logo />
        </Link>

        <nav className="flex items-center gap-1.5">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-[10px] px-3 py-2.5 type-button transition sm:px-4 ${
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mx-2 hidden h-6 w-px bg-slate-200 sm:block" />

          <div
            aria-hidden="true"
            className="hidden h-[34px] w-[34px] items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 sm:flex"
          >
            {user?.name.trim()[0]?.toUpperCase() ?? "?"}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-[10px] border border-slate-200 bg-white px-4 py-[9px] type-button text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1180px] flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
