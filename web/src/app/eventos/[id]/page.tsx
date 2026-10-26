"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import EventoFormModal, {
  type EventoForm,
} from "@/components/eventos/evento-form-modal";
import ExcluirEventoModal from "@/components/eventos/excluir-evento-modal";
import InscritosLista from "@/components/eventos/inscritos-lista";
import { api, mensagemDoErro } from "@/lib/api";
import { useSessao } from "@/lib/session";
import {
  dataLonga,
  formatarData,
  type Evento,
  type Inscrito,
} from "@/types/evento";

const botaoSecundario =
  "h-[46px] rounded-xl border px-[22px] text-base font-bold transition";

function formularioDe(evento: Evento): EventoForm {
  return {
    title: evento.title,
    description: evento.description,
    date: evento.date.slice(0, 10),
    time: evento.time,
    location: evento.location,
    imageUrl: evento.imageUrl,
  };
}

export default function EventoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useSessao();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const [removendo, setRemovendo] = useState<string[]>([]);

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<EventoForm | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    let ativo = true;

    api<Evento>(`/api/events/${id}`)
      .then(async (dados) => {
        // só o organizador pode listar os inscritos
        const lista =
          dados.ownerId === userId
            ? await api<Inscrito[]>(`/api/events/${id}/registrations`)
            : [];

        if (!ativo) return;
        setEvento(dados);
        setInscritos(lista);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(mensagemDoErro(err, "Não foi possível carregar o evento."));
      });

    return () => {
      ativo = false;
    };
  }, [id, userId, tentativa]);

  function tentarNovamente() {
    setErro("");
    setTentativa((atual) => atual + 1);
  }

  async function removerInscrito(inscrito: Inscrito) {
    if (!evento) return;

    setAviso("");
    setRemovendo((atuais) => [...atuais, inscrito.id]);

    try {
      await api<void>(`/api/registrations/${inscrito.id}`, {
        method: "DELETE",
      });
      setInscritos((atuais) => atuais.filter((item) => item.id !== inscrito.id));
      setEvento((atual) =>
        atual
          ? {
              ...atual,
              registrationsCount: Math.max(0, atual.registrationsCount - 1),
            }
          : atual,
      );
    } catch (err) {
      setAviso(mensagemDoErro(err, "Não foi possível remover o inscrito."));
    } finally {
      setRemovendo((atuais) => atuais.filter((item) => item !== inscrito.id));
    }
  }

  function abrirEdicao() {
    if (!evento) return;
    setForm(formularioDe(evento));
    setErroForm("");
    setEditando(true);
  }

  async function salvarEdicao(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!evento || !form) return;

    setSalvando(true);
    setErroForm("");

    try {
      const atualizado = await api<Evento>(`/api/events/${evento.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setEvento(atualizado);
      setImagemFalhou(false);
      setEditando(false);
    } catch (err) {
      setErroForm(mensagemDoErro(err, "Não foi possível salvar o evento."));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirEvento() {
    if (!evento) return;

    setExcluindo(true);
    setErroExclusao("");

    try {
      await api<void>(`/api/events/${evento.id}`, { method: "DELETE" });
      router.push("/eventos");
    } catch (err) {
      setErroExclusao(mensagemDoErro(err, "Não foi possível excluir o evento."));
      setExcluindo(false);
    }
  }

  const voltar = (
    <Link href="/eventos" className="font-medium text-slate-500 hover:text-slate-700">
      ← Voltar
    </Link>
  );

  if (erro) {
    return (
      <div>
        {voltar}
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-200 bg-white p-7 text-center"
        >
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
      </div>
    );
  }

  if (!evento) {
    return (
      <div>
        {voltar}
        <div
          aria-busy="true"
          className="mt-4 h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      </div>
    );
  }

  const organizador = evento.ownerId === userId;

  return (
    <div>
      {voltar}

      <header className="mb-7 mt-3 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <h1 className="mb-2 text-[44px] font-extrabold leading-[1.15] tracking-tight">
            {evento.title}
          </h1>
          <p className="text-lg font-medium tabular-nums text-slate-600">
            {dataLonga(evento.date)} · {evento.time} · {evento.location}
          </p>
        </div>

        {organizador && (
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={abrirEdicao}
              className={`${botaoSecundario} border-slate-300 bg-white text-slate-700 hover:bg-slate-100`}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                setErroExclusao("");
                setConfirmandoExclusao(true);
              }}
              className={`${botaoSecundario} border-red-200 bg-white text-red-600 hover:bg-red-50`}
            >
              Excluir
            </button>
          </div>
        )}
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

      <div
        className={`grid items-start gap-6 ${
          organizador ? "lg:grid-cols-2" : "max-w-3xl"
        }`}
      >
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative flex h-[200px] items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 text-sm font-medium text-orange-800">
            {imagemFalhou ? (
              "Imagem indisponível"
            ) : (
              // URL externa e arbitrária: next/image exigiria liberar cada domínio
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={evento.imageUrl}
                alt={`Imagem do evento ${evento.title}`}
                onError={() => setImagemFalhou(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-col gap-[18px] p-[26px]">
            <div>
              <h2 className="mb-2 text-[22px] font-bold leading-tight">
                Descrição
              </h2>
              <p className="max-w-[65ch] whitespace-pre-line leading-normal text-slate-600">
                {evento.description}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Data</dt>
                <dd className="font-bold tabular-nums">
                  {formatarData(evento.date)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Horário</dt>
                <dd className="font-bold tabular-nums">{evento.time}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-slate-500">Local</dt>
                <dd className="font-bold">{evento.location}</dd>
              </div>
            </dl>
          </div>
        </section>

        {organizador && (
          <InscritosLista
            inscritos={inscritos}
            total={evento.registrationsCount}
            removendo={removendo}
            onRemover={(inscrito) => void removerInscrito(inscrito)}
          />
        )}
      </div>

      {editando && form && (
        <EventoFormModal
          aberto
          eventoEditando={evento}
          form={form}
          salvando={salvando}
          erro={erroForm}
          onFormChange={setForm}
          onSalvar={(e) => void salvarEdicao(e)}
          onFechar={() => setEditando(false)}
        />
      )}

      {confirmandoExclusao && (
        <ExcluirEventoModal
          titulo={evento.title}
          excluindo={excluindo}
          erro={erroExclusao}
          onConfirmar={() => void excluirEvento()}
          onCancelar={() => setConfirmandoExclusao(false)}
        />
      )}
    </div>
  );
}
