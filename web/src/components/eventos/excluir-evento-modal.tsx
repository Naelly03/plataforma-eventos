"use client";

type ExcluirEventoModalProps = {
  titulo: string;
  excluindo: boolean;
  erro: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ExcluirEventoModal({
  titulo,
  excluindo,
  erro,
  onConfirmar,
  onCancelar,
}: ExcluirEventoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !excluindo) onCancelar();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="excluir-titulo"
        aria-describedby="excluir-descricao"
        className="w-full max-w-[420px] rounded-[20px] bg-white p-7 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.4)]"
      >
        <h2
          id="excluir-titulo"
          className="mb-2 type-h2"
        >
          Excluir evento?
        </h2>
        <p id="excluir-descricao" className="mb-[22px] type-body text-slate-600">
          “{titulo}” e as inscrições dele serão removidos. Essa ação não pode
          ser desfeita.
        </p>

        {erro && (
          <p
            role="alert"
            className="mb-4 rounded-[10px] bg-red-50 p-3 type-small text-red-700"
          >
            {erro}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancelar}
            disabled={excluindo}
            className="h-12 rounded-xl border border-slate-300 bg-white type-button text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={excluindo}
            className="h-12 rounded-xl bg-red-600 type-button text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </section>
    </div>
  );
}
