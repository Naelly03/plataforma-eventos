"use client";

import { useEffect, useMemo, useState } from "react";
import EventosIndicadores from "@/components/eventos/eventos-indicadores";
import EventosLista from "@/components/eventos/eventos-lista";
import EventoFormModal, {
  type EventoForm,
} from "@/components/eventos/evento-form-modal";
import { api, mensagemDoErro } from "@/lib/api";
import { useSessao } from "@/lib/session";
import type { Evento } from "@/types/evento";

const formularioVazio: EventoForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  imageUrl: "",
};

function ordenar(eventos: Evento[]) {
  return [...eventos].sort(
    (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
  );
}

export default function GerenciarEventosPage() {
  const { user } = useSessao();

  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [form, setForm] = useState<EventoForm>(formularioVazio);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");
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

  // A API lista todos os eventos; aqui só entram os que o usuário organiza.
  const meusEventos = useMemo(
    () => (eventos ?? []).filter((evento) => evento.ownerId === user?.id),
    [eventos, user?.id],
  );

  const eventosFiltrados = useMemo(
    () =>
      meusEventos.filter((evento) =>
        `${evento.title} ${evento.location}`
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [meusEventos, busca],
  );

  function tentarNovamente() {
    setErro("");
    setTentativa((atual) => atual + 1);
  }

  function abrirCadastro() {
    setEventoEditando(null);
    setForm({ ...formularioVazio });
    setErroForm("");
    setModalAberto(true);
  }

  function abrirEdicao(evento: Evento) {
    setEventoEditando(evento);

    setForm({
      title: evento.title,
      description: evento.description,
      date: evento.date.slice(0, 10),
      time: evento.time,
      location: evento.location,
      imageUrl: evento.imageUrl,
    });

    setErroForm("");
    setModalAberto(true);
  }

  async function salvarEvento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setErroForm("");

    try {
      if (eventoEditando) {
        const atualizado = await api<Evento>(
          `/api/events/${eventoEditando.id}`,
          { method: "PUT", body: JSON.stringify(form) },
        );

        setEventos((atuais) =>
          ordenar(
            (atuais ?? []).map((item) =>
              item.id === atualizado.id ? atualizado : item,
            ),
          ),
        );
        setMensagem("Evento atualizado.");
      } else {
        const criado = await api<Evento>("/api/events", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setEventos((atuais) => ordenar([...(atuais ?? []), criado]));
        setMensagem("Evento cadastrado.");
      }

      setModalAberto(false);
    } catch (err) {
      setErroForm(mensagemDoErro(err, "Não foi possível salvar o evento."));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirEvento(evento: Evento) {
    const confirmar = window.confirm(
      `Deseja excluir o evento "${evento.title}"?`,
    );

    if (!confirmar) return;

    try {
      await api<void>(`/api/events/${evento.id}`, { method: "DELETE" });

      setEventos((atuais) =>
        (atuais ?? []).filter((item) => item.id !== evento.id),
      );
      setMensagem("Evento removido.");
    } catch (err) {
      setMensagem(mensagemDoErro(err, "Não foi possível excluir o evento."));
    }
  }

  return (
    <main className="text-[#0F172A]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-500">
            Eventos / Meus eventos
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gerenciar eventos
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Crie, edite e acompanhe os eventos que você organiza.
          </p>
        </div>

        <button
          onClick={abrirCadastro}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C2410C] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        >
          <span className="text-lg">+</span>
          Novo evento
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-white p-7 text-center"
        >
          <b className="text-lg">Não foi possível carregar</b>
          <p className="mb-4 mt-1.5 text-slate-500">{erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="h-11 rounded-xl bg-[#EA580C] px-6 text-[15px] font-bold text-white transition hover:bg-[#C2410C]"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {eventos === null && !erro && (
        <div
          aria-busy="true"
          className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white"
        />
      )}

      {eventos && (
        <>
          <EventosIndicadores
            total={meusEventos.length}
            locais={new Set(meusEventos.map((evento) => evento.location)).size}
            resultados={eventosFiltrados.length}
          />

          <EventosLista
            eventos={eventosFiltrados}
            busca={busca}
            mensagem={mensagem}
            onBuscaChange={setBusca}
            onEditar={abrirEdicao}
            onExcluir={(evento) => void excluirEvento(evento)}
            onFecharMensagem={() => setMensagem("")}
          />
        </>
      )}

      <EventoFormModal
        aberto={modalAberto}
        eventoEditando={eventoEditando}
        form={form}
        salvando={salvando}
        erro={erroForm}
        onFormChange={setForm}
        onSalvar={(e) => void salvarEvento(e)}
        onFechar={() => setModalAberto(false)}
      />
    </main>
  );
}
