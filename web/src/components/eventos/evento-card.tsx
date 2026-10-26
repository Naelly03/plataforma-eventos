import Link from "next/link";
import { partesDaData, type Evento } from "@/types/evento";

type EventoCardProps = {
  evento: Evento;
  organizador: boolean;
  inscrito: boolean;
  pendente: boolean;
  onInscrever: () => void;
  onCancelar: () => void;
};

const chipClass = "rounded-full px-2.5 py-1 text-sm font-medium";

export default function EventoCard({
  evento,
  organizador,
  inscrito,
  pendente,
  onInscrever,
  onCancelar,
}: EventoCardProps) {
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
          <h3 className="text-[22px] font-bold leading-tight">
            <Link
              href={`/eventos/${evento.id}`}
              className="hover:text-orange-700"
            >
              {evento.title}
            </Link>
          </h3>
          <span className="text-sm font-medium tabular-nums text-slate-500">
            {evento.time} · {evento.location}
          </span>
        </div>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
        {evento.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {organizador && (
            <span className={`${chipClass} bg-orange-50 text-orange-700`}>
              Organizador
            </span>
          )}
          {inscrito && (
            <span className={`${chipClass} bg-green-100 text-green-700`}>
              Inscrito
            </span>
          )}
          <span className="text-sm font-medium tabular-nums text-slate-500">
            {total} {total === 1 ? "inscrito" : "inscritos"}
          </span>
        </div>

        {organizador ? (
          <Link
            href={`/eventos/${evento.id}`}
            className="h-10 rounded-[10px] bg-orange-50 px-4 py-2 text-[15px] font-bold text-orange-700 transition hover:bg-orange-100"
          >
            Gerenciar
          </Link>
        ) : inscrito ? (
          <button
            type="button"
            onClick={onCancelar}
            disabled={pendente}
            className="h-10 rounded-[10px] border border-red-200 bg-white px-4 text-[15px] font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendente ? "Cancelando..." : "Cancelar inscrição"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onInscrever}
            disabled={pendente}
            className="h-10 rounded-[10px] bg-linear-to-r from-orange-700 to-orange-600 px-4 text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(194,65,12,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendente ? "Inscrevendo..." : "Inscrever-se"}
          </button>
        )}
      </div>
    </article>
  );
}
