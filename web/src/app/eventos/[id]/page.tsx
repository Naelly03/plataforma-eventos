"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import EventoFormModal, {
  type EventoForm,
} from "@/components/eventos/evento-form-modal";
import ExcluirEventoModal from "@/components/eventos/excluir-evento-modal";
import { api, mensagemDoErro } from "@/lib/api";
import { dataLonga, type Evento } from "@/types/evento";

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

  const [evento, setEvento] = useState<Evento | null>(null);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [imagemFalhou, setImagemFalhou] = useState(false);

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<EventoForm | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

  useEffect(() => {
    let ativo = true;

    api<Evento>(`/api/events/${id}`)
      .then((dados) => {
        if (ativo) setEvento(dados);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(mensagemDoErro(err, "Não foi possível carregar o evento."));
      });

    return () => {
      ativo = false;
    };
  }, [id, tentativa]);

  function tentarNovamente() {
    setErro("");
    setTentativa((atual) => atual + 1);
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
    <Link href="/eventos" className="text-slate-500 hover:text-slate-800">
      ← Voltar
    </Link>
  );

  if (erro) {
    return (
      <div>
        {voltar}
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-white p-6 text-center"
        >
          <p className="mb-4 text-red-700">{erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="rounded-lg bg-[#EA580C] px-5 py-2.5 type-button text-white hover:bg-[#C2410C]"
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
        <p aria-busy="true" className="mt-4 text-slate-500">
          Carregando evento...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {voltar}

      <div className="mb-6 mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="type-h1">{evento.title}</h1>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setForm(formularioDe(evento));
              setErroForm("");
              setEditando(true);
            }}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 type-button text-slate-700 hover:bg-slate-100"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              setErroExclusao("");
              setConfirmandoExclusao(true);
            }}
            className="rounded-lg border border-red-200 bg-white px-5 py-2.5 type-button text-red-600 hover:bg-red-50"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {imagemFalhou ? (
          <p className="bg-slate-100 py-16 text-center type-small text-slate-500">
            Imagem indisponível
          </p>
        ) : (
          // URL externa e arbitrária: next/image exigiria liberar cada domínio
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.imageUrl}
            alt={`Imagem do evento ${evento.title}`}
            onError={() => setImagemFalhou(true)}
            className="h-56 w-full object-cover"
          />
        )}

        <dl className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <dt className="type-label text-slate-500">Data</dt>
            <dd className="font-bold">{dataLonga(evento.date)}</dd>
          </div>
          <div>
            <dt className="type-label text-slate-500">Horário</dt>
            <dd className="font-bold">{evento.time}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="type-label text-slate-500">Local</dt>
            <dd className="font-bold">{evento.location}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="type-label text-slate-500">Descrição</dt>
            <dd className="whitespace-pre-line text-slate-700">
              {evento.description}
            </dd>
          </div>
        </dl>
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
