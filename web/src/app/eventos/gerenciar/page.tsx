
"use client";

import { useMemo, useState } from "react";
import EventosIndicadores from "@/components/eventos/eventos-indicadores";
import EventosLista from "@/components/eventos/eventos-lista";
import EventoFormModal, {
  type EventoForm,
} from "@/components/eventos/evento-form-modal";
import { eventosIniciais, type Evento } from "@/types/evento";

const formularioVazio: EventoForm = {
  titulo: "",
  categoria: "",
  data: "",
  horario: "",
  local: "",
  descricao: "",
};

export default function GerenciarEventosPage() {
  const [eventos, setEventos] = useState(eventosIniciais);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [form, setForm] = useState<EventoForm>(formularioVazio);

  const eventosFiltrados = useMemo(
    () =>
      eventos.filter((evento) =>
        `${evento.titulo} ${evento.categoria} ${evento.local}`
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [eventos, busca],
  );

  function abrirCadastro() {
    setEventoEditando(null);
    setForm({ ...formularioVazio });
    setModalAberto(true);
  }

  function abrirEdicao(evento: Evento) {
    setEventoEditando(evento);

    const [dia, mes, ano] = evento.data.split("/");

    setForm({
      titulo: evento.titulo,
      categoria: evento.categoria,
      data: `${ano}-${mes}-${dia}`,
      horario: evento.horario,
      local: evento.local,
      descricao: evento.descricao,
    });

    setModalAberto(true);
  }

  function salvarEvento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const [ano, mes, dia] = form.data.split("-");

    const evento: Evento = {
      id: eventoEditando?.id ?? Date.now(),
      ...form,
      data: `${dia}/${mes}/${ano}`,
    };

    if (eventoEditando) {
      setEventos((anteriores) =>
        anteriores.map((item) =>
          item.id === eventoEditando.id ? evento : item,
        ),
      );
      setMensagem("Evento atualizado nesta demonstração.");
    } else {
      setEventos((anteriores) => [...anteriores, evento]);
      setMensagem("Evento cadastrado nesta demonstração.");
    }

    setModalAberto(false);
  }

  function excluirEvento(evento: Evento) {
    const confirmar = window.confirm(
      `Deseja excluir o evento "${evento.titulo}"?`,
    );

    if (!confirmar) return;

    setEventos((anteriores) =>
      anteriores.filter((item) => item.id !== evento.id),
    );
    setMensagem("Evento removido desta demonstração.");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-500">
            Painel administrativo / Eventos
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gerenciar eventos
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Cadastre, organize e acompanhe os eventos da plataforma.
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

      <EventosIndicadores
        total={eventos.length}
        categorias={new Set(eventos.map((evento) => evento.categoria)).size}
        resultados={eventosFiltrados.length}
      />

      <EventosLista
        eventos={eventosFiltrados}
        busca={busca}
        mensagem={mensagem}
        onBuscaChange={setBusca}
        onEditar={abrirEdicao}
        onExcluir={excluirEvento}
        onFecharMensagem={() => setMensagem("")}
      />

      <EventoFormModal
        aberto={modalAberto}
        eventoEditando={eventoEditando}
        form={form}
        onFormChange={setForm}
        onSalvar={salvarEvento}
        onFechar={() => setModalAberto(false)}
      />
    </main>
  );
}
