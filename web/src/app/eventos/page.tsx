
import Link from "next/link";

const indicadores = [
  { titulo: "Total de eventos", valor: 24 },
  { titulo: "Inscrições", valor: 386 },
  { titulo: "Publicados", valor: 18 },
];

const eventos = [
  { id: 1, titulo: "Tech Summit 2026", data: "15/11/2026", inscritos: 128 },
  { id: 2, titulo: "Dev Experience", data: "22/11/2026", inscritos: 86 },
  { id: 3, titulo: "Innovation Day", data: "05/12/2026", inscritos: 54 },
];

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Visão geral
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Acompanhe os dados da sua plataforma.
            </p>
          </div>

          <Link
            href="/eventos/gerenciar"
            className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            + Gerenciar eventos
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {indicadores.map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <p className="text-sm text-gray-500">{item.titulo}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {item.valor}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Próximos eventos</h2>
            <Link
              href="/eventos/gerenciar"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Ver todos
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {evento.titulo}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {evento.data}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {evento.inscritos} inscritos
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/eventos/gerenciar"
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-orange-300"
          >
            <h2 className="font-semibold text-gray-900">Gerenciar eventos</h2>
            <p className="mt-1 text-sm text-gray-500">
              Cadastre, edite e organize eventos.
            </p>
          </Link>

          <Link
            href="/inscricoes"
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-orange-300"
          >
            <h2 className="font-semibold text-gray-900">Inscrições</h2>
            <p className="mt-1 text-sm text-gray-500">
              Acesse a área de inscrições.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
