
export default function InscricoesPage() {
  return (
    <main className="p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-orange-600">
            Gestão de participantes
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Inscrições
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Acompanhe e gerencie as inscrições dos participantes nos eventos.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-600"
              aria-hidden="true"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Gerenciamento de inscrições
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Aqui você poderá consultar os participantes inscritos,
            visualizar os eventos relacionados e acompanhar o status
            de cada inscrição.
          </p>

          <span className="mt-5 inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            Área de inscrições
          </span>
        </div>
      </section>
    </main>
  );
}
