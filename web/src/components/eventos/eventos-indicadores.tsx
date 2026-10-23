
"use client";

type EventosIndicadoresProps = {
  total: number;
  categorias: number;
  resultados: number;
};

export default function EventosIndicadores({
  total,
  categorias,
  resultados,
}: EventosIndicadoresProps) {
  const indicadores = [
    {
      titulo: "Total de eventos",
      valor: total,
      descricao: "Eventos cadastrados nesta sessão",
      simbolo: "▦",
      destaque: true,
    },
    {
      titulo: "Categorias",
      valor: categorias,
      descricao: "Categorias diferentes",
      simbolo: "◈",
      destaque: false,
    },
    {
      titulo: "Resultados da busca",
      valor: resultados,
      descricao: "Eventos correspondentes ao filtro",
      simbolo: "⌕",
      destaque: false,
    },
  ];

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {indicadores.map((item) => (
        <article
          key={item.titulo}
          className={`rounded-xl border border-slate-200 bg-white p-5 ${
            item.titulo === "Resultados da busca"
              ? "sm:col-span-2 xl:col-span-1"
              : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              {item.titulo}
            </p>

            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                item.destaque
                  ? "bg-orange-50 text-[#EA580C]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.simbolo}
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold">{item.valor}</p>

          <p className="mt-1 text-sm text-slate-500">
            {item.descricao}
          </p>
        </article>
      ))}
    </section>
  );
}
