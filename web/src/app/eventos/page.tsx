"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventoFormModal, {
  type EventoForm,
} from "@/components/eventos/evento-form-modal";
import ExcluirEventoModal from "@/components/eventos/excluir-evento-modal";
import { api, mensagemDoErro } from "@/lib/api";
import { formatarData, type Evento } from "@/types/evento";

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

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [form, setForm] = useState<EventoForm>(formularioVazio);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [eventoParaExcluir, setEventoParaExcluir] = useState<Evento | null>(
    null,
  );
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

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
      } else {
        const criado = await api<Evento>("/api/events", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setEventos((atuais) => ordenar([...(atuais ?? []), criado]));
      }

      setModalAberto(false);
    } catch (err) {
      setErroForm(mensagemDoErro(err, "Não foi possível salvar o evento."));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirEvento() {
    if (!eventoParaExcluir) return;

    setExcluindo(true);
    setErroExclusao("");

    try {
      await api<void>(`/api/events/${eventoParaExcluir.id}`, {
        method: "DELETE",
      });

      setEventos((atuais) =>
        (atuais ?? []).filter((item) => item.id !== eventoParaExcluir.id),
      );
      setEventoParaExcluir(null);
    } catch (err) {
      setErroExclusao(mensagemDoErro(err, "Não foi possível excluir o evento."));
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="type-h1">Eventos</h1>

        <button
          type="button"
          onClick={abrirCadastro}
          className="rounded-lg bg-[#EA580C] px-5 py-3 type-button text-white hover:bg-[#C2410C]"
        >
          Novo evento
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-white p-6 text-center"
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
      )}

      {eventos === null && !erro && (
        <p aria-busy="true" className="text-slate-500">
          Carregando eventos...
        </p>
      )}

      {eventos && eventos.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Nenhum evento cadastrado.
        </p>
      )}

      {eventos && eventos.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left type-small">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Horário</th>
                <th className="px-4 py-3">Local</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td className="px-4 py-3 font-bold">{evento.title}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatarData(evento.date)}
                  </td>
                  <td className="px-4 py-3">{evento.time}</td>
                  <td className="px-4 py-3">{evento.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/eventos/${evento.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
                      >
                        Ver
                      </Link>
                      <button
                        type="button"
                        onClick={() => abrirEdicao(evento)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setErroExclusao("");
                          setEventoParaExcluir(evento);
                        }}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50"
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
      )}

      {eventoParaExcluir && (
        <ExcluirEventoModal
          titulo={eventoParaExcluir.title}
          excluindo={excluindo}
          erro={erroExclusao}
          onConfirmar={() => void excluirEvento()}
          onCancelar={() => setEventoParaExcluir(null)}
        />
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
    </div>
  );
}
