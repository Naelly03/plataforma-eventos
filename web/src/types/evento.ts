// Mesmo formato do model Event da API (id é cuid; date vem como ISO).
export type Evento = {
  id: string;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD" ou ISO completo, como a API devolve
  time: string; // "HH:mm"
  location: string;
  imageUrl: string;
  ownerId: string; // organizador (quem criou o evento)
  registrationsCount: number;
};

export type Inscricao = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
};

// Inscrição como o organizador a vê (com os dados do participante)
export type Inscrito = Inscricao & {
  user: { id: string; name: string; email: string };
};

const mesesLongos = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const meses = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

// "2026-11-15" ou "2026-11-15T00:00:00.000Z" -> "15/11/2026"
export function formatarData(date: string) {
  const [ano, mes, dia] = date.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

// "2026-11-15..." -> "15 de novembro de 2026"
export function dataLonga(date: string) {
  const [ano, mes, dia] = date.slice(0, 10).split("-");
  return `${Number(dia)} de ${mesesLongos[Number(mes) - 1] ?? ""} de ${ano}`;
}

// "2026-11-15..." -> { dia: "15", mes: "NOV" }
export function partesDaData(date: string) {
  const [, mes, dia] = date.slice(0, 10).split("-");
  return { dia, mes: meses[Number(mes) - 1] ?? "" };
}
