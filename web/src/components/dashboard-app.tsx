"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const rotasPublicas = ["/login", "/cadastro"];

export default function DashboardApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, isRefetching } = authClient.useSession();

  const rotaPublica = rotasPublicas.includes(pathname);

  const verificando = (isPending || isRefetching) && !session;
  const semSessao = !verificando && !session;

  useEffect(() => {
    if (!rotaPublica && semSessao) router.replace("/login");
  }, [rotaPublica, semSessao, router]);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  if (rotaPublica) {
    return <div className="flex min-h-screen flex-col">{children}</div>;
  }

  if (!session) {
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
