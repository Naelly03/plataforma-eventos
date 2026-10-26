"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventoCard from "@/components/eventos/evento-card";
import { api, mensagemDoErro } from "@/lib/api";
import { useSessao } from "@/lib/session";
import { formatarData, type Evento } from "@/types/evento";

export default function EventosPage() {
  const { user } = useSessao();

  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    api<Evento[]>("/api/events")
      .then((lista) => {
        if (ativo) setEventos(lista);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(mensagemDoErro(err, "Não foi possível carregar os eventos."));
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  function tentarNovamente() {
    setErro("");
    setTentativa((atual) => atual + 1);
  }

  const carregando = eventos === null && !erro;
  const hoje = new Date().toLocaleDateString("sv-SE");

  const proximos = (eventos ?? []).filter(
    (evento) => evento.date.slice(0, 10) >= hoje,
  );
  const anteriores = (eventos ?? [])
    .filter((evento) => evento.date.slice(0, 10) < hoje)
    .reverse();

  const primeiroNome = user?.name.trim().split(" ")[0];

  return (
    <div>
      <header className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1.5 type-h1">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""}
          </h1>
          <p className="max-w-[65ch] type-body text-slate-500">
            {eventos
              ? `Há ${proximos.length} ${
                  proximos.length === 1 ? "evento próximo" : "eventos próximos"
                }.`
              : "Acompanhe os eventos da plataforma."}
          </p>
        </div>

        <Link
          href="/eventos/gerenciar"
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-700 to-orange-600 px-[22px] py-[13px] type-button text-white shadow-[0_6px_18px_rgba(194,65,12,0.28)] transition hover:brightness-110"
        >
          <span className="text-xl font-extrabold leading-none">+</span>
          Criar novo evento
        </Link>
      </header>

      {carregando && (
        <div
          aria-busy="true"
          className="grid gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[210px] animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {erro && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-white p-7 text-center"
        >
          <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl font-extrabold text-red-600">
            !
          </div>
          <b className="type-h3">Não foi possível carregar</b>
          <p className="mb-4 mt-1.5 text-slate-500">{erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="h-11 rounded-xl bg-linear-to-r from-orange-700 to-orange-600 px-6 type-button text-white transition hover:brightness-110"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {eventos && (
        <>
          <h2 className="mb-4 type-h2">
            Próximos eventos
          </h2>

          {proximos.length > 0 ? (
            <div className="mb-11 grid gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {proximos.map((evento) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  organizador={evento.ownerId === user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="mb-11 rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center text-slate-500">
              Nenhum evento próximo no momento.
            </div>
          )}

          {anteriores.length > 0 && (
            <>
              <h2 className="mb-4 type-h2">
                Eventos anteriores
              </h2>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {anteriores.map((evento) => (
                  <div
                    key={evento.id}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <div className="text-lg font-bold leading-tight">
                        <Link
                          href={`/eventos/${evento.id}`}
                          className="hover:text-orange-700"
                        >
                          {evento.title}
                        </Link>
                      </div>
                      <div className="type-label text-slate-500">
                        {formatarData(evento.date)} · {evento.time} ·{" "}
                        {evento.location}
                      </div>
                    </div>

                    {evento.ownerId === user?.id && (
                      <span className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-1 type-label text-green-700">
                        Organizador
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
