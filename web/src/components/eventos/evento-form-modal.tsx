
"use client";

import type { FormEvent } from "react";
import type { Evento } from "@/types/evento";

export type EventoForm = {
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  descricao: string;
};

type EventoFormModalProps = {
  aberto: boolean;
  eventoEditando: Evento | null;
  form: EventoForm;
  onFormChange: (form: EventoForm) => void;
  onSalvar: (e: FormEvent<HTMLFormElement>) => void;
  onFechar: () => void;
};

const campoClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100";

export default function EventoFormModal({
  aberto,
  eventoEditando,
  form,
  onFormChange,
  onSalvar,
  onFechar,
}: EventoFormModalProps) {
  if (!aberto) return null;

  function atualizarCampo(campo: keyof EventoForm, valor: string) {
    onFormChange({ ...form, [campo]: valor });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 id="modal-titulo" className="text-xl font-bold">
              {eventoEditando ? "Editar evento" : "Novo evento"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Preencha as informações do evento.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSalvar} className="space-y-4 p-5 sm:p-6">
          <div>
            <label htmlFor="titulo" className="mb-1.5 block text-sm font-medium">
              Nome do evento
            </label>
            <input
              id="titulo"
              required
              maxLength={120}
              value={form.titulo}
              onChange={(e) => atualizarCampo("titulo", e.target.value)}
              placeholder="Ex.: Tech Summit"
              className={campoClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="categoria" className="mb-1.5 block text-sm font-medium">
                Categoria
              </label>
              <input
                id="categoria"
                required
                maxLength={60}
                value={form.categoria}
                onChange={(e) => atualizarCampo("categoria", e.target.value)}
                placeholder="Ex.: Tecnologia"
                className={campoClass}
              />
            </div>

            <div>
              <label htmlFor="data" className="mb-1.5 block text-sm font-medium">
                Data
              </label>
              <input
                id="data"
                required
                type="date"
                value={form.data}
                onChange={(e) => atualizarCampo("data", e.target.value)}
                className={campoClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="horario" className="mb-1.5 block text-sm font-medium">
                Horário
              </label>
              <input
                id="horario"
                required
                type="time"
                value={form.horario}
                onChange={(e) => atualizarCampo("horario", e.target.value)}
                className={campoClass}
              />
            </div>

            <div>
              <label htmlFor="local" className="mb-1.5 block text-sm font-medium">
                Local
              </label>
              <input
                id="local"
                required
                maxLength={160}
                value={form.local}
                onChange={(e) => atualizarCampo("local", e.target.value)}
                placeholder="Ex.: Teresina, PI"
                className={campoClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="mb-1.5 block text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="descricao"
              required
              maxLength={1000}
              rows={3}
              value={form.descricao}
              onChange={(e) => atualizarCampo("descricao", e.target.value)}
              placeholder="Descreva o objetivo do evento..."
              className={`${campoClass} resize-y`}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#EA580C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C2410C]"
            >
              {eventoEditando ? "Salvar alterações" : "Cadastrar evento"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
