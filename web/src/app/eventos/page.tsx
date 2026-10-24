"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventoCard from "@/components/eventos/evento-card";
import { api, mensagemDoErro } from "@/lib/api";
import { useSessao } from "@/lib/session";
import {
  formatarData,
  type Evento,
  type Inscricao,
} from "@/types/evento";

export default function EventosPage() {
  const { user } = useSessao();

  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [pendentes, setPendentes] = useState<string[]>([]);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    Promise.all([
      api<Evento[]>("/api/events"),
      api<Inscricao[]>("/api/registrations"),
    ])
      .then(([listaEventos, listaInscricoes]) => {
        if (!ativo) return;
        setEventos(listaEventos);
        setInscricoes(listaInscricoes);
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

  function marcarPendente(id: string, ativo: boolean) {
    setPendentes((atuais) =>
      ativo ? [...atuais, id] : atuais.filter((item) => item !== id),
    );
  }

  async function inscrever(evento: Evento) {
    setAviso("");
    marcarPendente(evento.id, true);

    try {
      const inscricao = await api<Inscricao>(
        `/api/events/${evento.id}/registrations`,
        { method: "POST" },
      );

      setInscricoes((atuais) => [inscricao, ...atuais]);
    } catch (err) {
      setAviso(mensagemDoErro(err, "Não foi possível fazer a inscrição."));
    } finally {
      marcarPendente(evento.id, false);
    }
  }

  async function cancelar(evento: Evento, inscricao: Inscricao) {
    setAviso("");
    marcarPendente(evento.id, true);

    try {
      await api<void>(`/api/registrations/${inscricao.id}`, {
        method: "DELETE",
      });

      setInscricoes((atuais) =>
        atuais.filter((item) => item.id !== inscricao.id),
      );
    } catch (err) {
      setAviso(mensagemDoErro(err, "Não foi possível cancelar a inscrição."));
    } finally {
      marcarPendente(evento.id, false);
    }
  }

  const carregando = eventos === null && !erro;
  const hoje = new Date().toLocaleDateString("sv-SE");
  const inscricaoPorEvento = new Map(
    inscricoes.map((inscricao) => [inscricao.eventId, inscricao]),
  );

  const proximos = (eventos ?? []).filter(
    (evento) => evento.date.slice(0, 10) >= hoje,
  );
  const anteriores = (eventos ?? [])
    .filter((evento) => evento.date.slice(0, 10) < hoje)
    .reverse();
  const inscritosNosProximos = proximos.filter((evento) =>
    inscricaoPorEvento.has(evento.id),
  ).length;

  const primeiroNome = user?.name.trim().split(" ")[0];

  return (
    <div>
      <header className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1.5 text-[44px] font-extrabold leading-[1.15] tracking-tight">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""}
          </h1>
          <p className="max-w-[65ch] text-lg text-slate-500">
            {eventos
              ? `Há ${proximos.length} ${
                  proximos.length === 1 ? "evento próximo" : "eventos próximos"
                } e você está inscrito em ${inscritosNosProximos}.`
              : "Descubra e inscreva-se nos próximos eventos."}
          </p>
        </div>

        <Link
          href="/eventos/gerenciar"
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-700 to-orange-600 px-[22px] py-[13px] text-[15px] font-bold text-white shadow-[0_6px_18px_rgba(194,65,12,0.28)] transition hover:brightness-110"
        >
          <span className="text-xl font-extrabold leading-none">+</span>
          Criar novo evento
        </Link>
      </header>

      {aviso && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{aviso}</span>
          <button
            type="button"
            onClick={() => setAviso("")}
            aria-label="Fechar aviso"
            className="font-semibold"
          >
            ×
          </button>
        </div>
      )}

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
          <b className="text-lg">Não foi possível carregar</b>
          <p className="mb-4 mt-1.5 text-slate-500">{erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="h-11 rounded-xl bg-linear-to-r from-orange-700 to-orange-600 px-6 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {eventos && (
        <>
          <h2 className="mb-4 text-[32px] font-extrabold leading-tight tracking-[-0.005em]">
            Próximos eventos
          </h2>

          {proximos.length > 0 ? (
            <div className="mb-11 grid gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {proximos.map((evento) => {
                const inscricao = inscricaoPorEvento.get(evento.id);

                return (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    organizador={evento.ownerId === user?.id}
                    inscrito={Boolean(inscricao)}
                    pendente={pendentes.includes(evento.id)}
                    onInscrever={() => void inscrever(evento)}
                    onCancelar={() =>
                      inscricao && void cancelar(evento, inscricao)
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="mb-11 rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center text-slate-500">
              Nenhum evento próximo no momento.
            </div>
          )}

          {anteriores.length > 0 && (
            <>
              <h2 className="mb-4 text-[32px] font-extrabold leading-tight tracking-[-0.005em]">
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
                        {evento.title}
                      </div>
                      <div className="text-sm font-medium tabular-nums text-slate-500">
                        {formatarData(evento.date)} · {evento.time} ·{" "}
                        {evento.location}
                      </div>
                    </div>

                    {inscricaoPorEvento.has(evento.id) && (
                      <span className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-1 text-sm font-medium text-green-700">
                        Você se inscreveu
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
