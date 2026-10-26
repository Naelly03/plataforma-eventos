"use client";

import { useState } from "react";
import { formatarData, type Inscrito } from "@/types/evento";

type InscritosListaProps = {
  inscritos: Inscrito[];
  total: number;
  removendo: string[];
  onRemover: (inscrito: Inscrito) => void;
};

export default function InscritosLista({
  inscritos,
  total,
  removendo,
  onRemover,
}: InscritosListaProps) {
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLowerCase();
  const filtrados = inscritos.filter(
    (inscrito) =>
      !termo ||
      inscrito.user.name.toLowerCase().includes(termo) ||
      inscrito.user.email.toLowerCase().includes(termo),
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-[26px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-bold leading-tight">Inscritos</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium tabular-nums text-slate-600">
          {total} no total
        </span>
      </div>

      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou email"
        aria-label="Buscar inscrito"
        className="mb-2 h-11 w-full rounded-[10px] border border-slate-300 px-3.5 text-base outline-none transition focus:border-orange-700 focus:ring-[3px] focus:ring-orange-600/20"
      />

      {filtrados.length > 0 ? (
        <>
          <ul>
            {filtrados.map((inscrito) => (
              <li
                key={inscrito.id}
                className="flex items-center gap-3 border-b border-slate-100 py-3"
              >
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-50 font-bold text-orange-700"
                >
                  {inscrito.user.name.trim()[0]?.toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold leading-snug">
                    {inscrito.user.name}
                  </div>
                  <div className="truncate text-sm font-medium text-slate-500">
                    {inscrito.user.email} · {formatarData(inscrito.createdAt)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemover(inscrito)}
                  disabled={removendo.includes(inscrito.id)}
                  className="p-2 text-sm font-medium text-red-600 hover:underline disabled:opacity-60"
                >
                  {removendo.includes(inscrito.id) ? "Removendo..." : "Remover"}
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-sm tabular-nums text-slate-500">
            Mostrando {filtrados.length} de {total}
          </p>
        </>
      ) : (
        <p className="py-8 text-center text-sm text-slate-500">
          Nenhum inscrito encontrado.
        </p>
      )}
    </section>
  );
}
