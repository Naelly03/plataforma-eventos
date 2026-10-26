import Link from "next/link";
import { LogoIcon } from "@/components/logo";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-[1180px] flex-1 items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2">
      <div>
        <span className="inline-block rounded-full bg-orange-50 px-3 py-1.5 type-label text-orange-700">
          Gestão de eventos
        </span>

        <h1 className="mb-3.5 mt-[18px] type-display">
          Agendou
          <span className="bg-linear-to-r from-orange-700 to-orange-600 bg-clip-text text-transparent">
            .
          </span>
        </h1>

        <p className="mb-[30px] max-w-[65ch] type-body text-slate-600">
          Eventos organizados, presença confirmada. Crie, convide e acompanhe
          tudo em um só lugar.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/cadastro"
            className="rounded-xl bg-linear-to-r from-orange-700 to-orange-600 px-[26px] py-3.5 type-button text-white shadow-[0_8px_22px_rgba(194,65,12,0.3)] transition hover:brightness-110"
          >
            Começar agora
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-[26px] py-[13px] type-button text-slate-800 transition hover:bg-slate-100"
          >
            Já tenho conta
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex aspect-square max-h-[460px] w-full items-center justify-center rounded-[28px] bg-linear-to-br from-orange-50 to-pink-100 p-6"
      >
        <LogoIcon size={160} />
      </div>
    </main>
  );
}
