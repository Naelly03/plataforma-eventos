export type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
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

export function formatarData(date: string) {
  const [ano, mes, dia] = date.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function dataLonga(date: string) {
  const [ano, mes, dia] = date.slice(0, 10).split("-");
  return `${Number(dia)} de ${mesesLongos[Number(mes) - 1] ?? ""} de ${ano}`;
}
