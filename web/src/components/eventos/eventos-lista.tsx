
"use client";

import type { Evento } from "@/types/evento";

type EventosListaProps = {
  eventos: Evento[];
  busca: string;
  mensagem: string;
  onBuscaChange: (valor: string) => void;
  onEditar: (evento: Evento) => void;
  onExcluir: (evento: Evento) => void;
  onFecharMensagem: () => void;
};

const campoClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100";

export default function EventosLista({
  eventos,
  busca,
  mensagem,
  onBuscaChange,
  onEditar,
  onExcluir,
  onFecharMensagem,
}: EventosListaProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Todos os eventos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Consulte e edite os eventos cadastrados.
          </p>
        </div>

        <input
          type="search"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar evento..."
          aria-label="Buscar evento"
          className={`${campoClass} sm:max-w-xs`}
        />
      </div>

      {mensagem && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 border-b border-orange-100 bg-orange-50 px-5 py-3 text-sm text-orange-800"
        >
          <span>{mensagem}</span>
          <button
            onClick={onFecharMensagem}
            className="font-semibold"
            aria-label="Fechar mensagem"
          >
            ×
          </button>
        </div>
      )}

      {eventos.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <h3 className="font-semibold">Nenhum evento encontrado</h3>
          <p className="mt-1 text-sm text-slate-500">
            Tente outro termo de busca ou cadastre um novo evento.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Evento</th>
                  <th className="px-5 py-4 font-semibold">Data e hora</th>
                  <th className="px-5 py-4 font-semibold">Local</th>
                  <th className="px-5 py-4 font-semibold">Categoria</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {eventos.map((evento) => (
                  <tr key={evento.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {evento.titulo}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {evento.descricao}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium">{evento.data}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {evento.horario}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {evento.local}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                        {evento.categoria}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEditar(evento)}
                          className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onExcluir(evento)}
                          className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {eventos.map((evento) => (
              <article
                key={evento.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{evento.titulo}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {evento.data} · {evento.horario}
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-700">
                    {evento.categoria}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600">{evento.local}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {evento.descricao}
                </p>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => onEditar(evento)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold hover:bg-orange-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onExcluir(evento)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
        Exibindo {eventos.length} resultado(s) da busca
      </div>
    </section>
  );
}
