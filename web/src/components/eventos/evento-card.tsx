import Link from "next/link";
import { partesDaData, type Evento } from "@/types/evento";

type EventoCardProps = {
  evento: Evento;
  organizador: boolean;
};

export default function EventoCard({ evento, organizador }: EventoCardProps) {
  const { dia, mes } = partesDaData(evento.date);
  const total = evento.registrationsCount;

  return (
    <article className="flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.18)]">
      <div className="flex items-center gap-3.5">
        <div className="flex h-[60px] w-14 flex-none flex-col items-center justify-center rounded-xl bg-linear-to-br from-orange-700 to-orange-600 text-white">
          <b className="text-[22px] font-extrabold leading-none tabular-nums">
            {dia}
          </b>
          <span className="text-xs font-bold tracking-[0.08em]">{mes}</span>
        </div>

        <div className="min-w-0">
          <h3 className="type-h3">
            <Link
              href={`/eventos/${evento.id}`}
              className="hover:text-orange-700"
            >
              {evento.title}
            </Link>
          </h3>
          <span className="type-label text-slate-500">
            {evento.time} · {evento.location}
          </span>
        </div>
      </div>

      <p className="line-clamp-2 type-small text-slate-600">
        {evento.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {organizador && (
            <span className="rounded-full bg-green-100 px-2.5 py-1 type-label text-green-700">
              Organizador
            </span>
          )}
          <span className="type-label text-slate-500">
            {total} {total === 1 ? "inscrito" : "inscritos"}
          </span>
        </div>

        <Link
          href={`/eventos/${evento.id}`}
          className="h-10 rounded-[10px] bg-orange-50 px-4 py-2 type-button text-orange-700 transition hover:bg-orange-100"
        >
          {organizador ? "Gerenciar" : "Ver detalhes"}
        </Link>
      </div>
    </article>
  );
}
