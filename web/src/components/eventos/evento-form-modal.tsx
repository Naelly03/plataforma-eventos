
"use client";

import type { FormEvent } from "react";
import type { Evento } from "@/types/evento";

export type EventoForm = Pick<
  Evento,
  "title" | "description" | "date" | "time" | "location" | "imageUrl"
>;

type EventoFormModalProps = {
  aberto: boolean;
  eventoEditando: Evento | null;
  form: EventoForm;
  salvando: boolean;
  erro: string;
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
  salvando,
  erro,
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
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              Título
            </label>
            <input
              id="title"
              required
              minLength={3}
              maxLength={120}
              value={form.title}
              onChange={(e) => atualizarCampo("title", e.target.value)}
              placeholder="Ex.: Tech Summit"
              className={campoClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-medium">
                Data
              </label>
              <input
                id="date"
                required
                type="date"
                value={form.date}
                onChange={(e) => atualizarCampo("date", e.target.value)}
                className={campoClass}
              />
            </div>

            <div>
              <label htmlFor="time" className="mb-1.5 block text-sm font-medium">
                Horário
              </label>
              <input
                id="time"
                required
                type="time"
                value={form.time}
                onChange={(e) => atualizarCampo("time", e.target.value)}
                className={campoClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
              Local
            </label>
            <input
              id="location"
              required
              maxLength={160}
              value={form.location}
              onChange={(e) => atualizarCampo("location", e.target.value)}
              placeholder="Ex.: Teresina, PI"
              className={campoClass}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium">
              URL da imagem
            </label>
            <input
              id="imageUrl"
              required
              type="url"
              value={form.imageUrl}
              onChange={(e) => atualizarCampo("imageUrl", e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className={campoClass}
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="description"
              required
              maxLength={1000}
              rows={3}
              value={form.description}
              onChange={(e) => atualizarCampo("description", e.target.value)}
              placeholder="Descreva o objetivo do evento..."
              className={`${campoClass} resize-y`}
            />
          </div>

          {erro && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {erro}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-[#EA580C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C2410C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : eventoEditando
                  ? "Salvar alterações"
                  : "Cadastrar evento"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
