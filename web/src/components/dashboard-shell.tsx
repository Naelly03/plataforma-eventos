
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { label: "Visão geral", href: "/eventos", icon: "▦" },
  { label: "Eventos", href: "/eventos/gerenciar", icon: "▣" },
  { label: "Inscrições", href: "/inscricoes", icon: "♧" },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    localStorage.removeItem("eventum_token");
    localStorage.removeItem("eventum_user");
    router.push("/login");
  }

  if (pathname === "/login" || pathname === "/cadastro") {
    return <>{children}</>;
  }

  function renderMenu(mobile = false) {
    return (
      <>
        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Menu principal
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/eventos" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (mobile) setMenuAberto(false);
                  }}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-orange-50 text-[#EA580C]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                      active
                        ? "bg-white text-[#EA580C] shadow-sm"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#EA580C]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg">
              ↪
            </span>
            Sair da conta
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Menu lateral para computador */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <Link
          href="/eventos"
          className="flex h-[73px] items-center border-b border-slate-100 px-6 text-[28px] font-extrabold tracking-tight text-slate-900"
        >
          Agendou<span className="text-[#EA580C]">.</span>
        </Link>

        {renderMenu()}
      </aside>

      {/* Área principal */}
      <div className="min-w-0 md:ml-64">
        <header className="sticky top-0 z-20 flex h-[73px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Botão do menu para celular */}
            <button
              type="button"
              onClick={() => setMenuAberto(!menuAberto)}
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-600 transition hover:bg-slate-50 md:hidden"
            >
              {menuAberto ? "×" : "☰"}
            </button>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {pathname === "/eventos/gerenciar"
                  ? "Gerenciamento de eventos"
                  : pathname === "/inscricoes"
                    ? "Inscrições"
                    : "Painel administrativo"}
              </p>
              <p className="mt-1 hidden text-xs text-slate-400 sm:block">
                Agendou. · Gestão de eventos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-700">
                Administrador
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Área administrativa
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-[#EA580C] ring-1 ring-orange-100">
              A
            </div>
          </div>
        </header>

        {/* Menu móvel */}
        {menuAberto && (
          <>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMenuAberto(false)}
              className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"
            />

            <aside className="fixed inset-y-0 left-0 z-40 flex w-[min(80vw,280px)] flex-col border-r border-slate-200 bg-white shadow-xl md:hidden">
              <div className="flex h-[73px] items-center justify-between border-b border-slate-100 px-5">
                <Link
                  href="/eventos"
                  onClick={() => setMenuAberto(false)}
                  className="text-2xl font-extrabold tracking-tight text-slate-900"
                >
                  Agendou<span className="text-[#EA580C]">.</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuAberto(false)}
                  aria-label="Fechar menu"
                  className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              {renderMenu(true)}
            </aside>
          </>
        )}

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
