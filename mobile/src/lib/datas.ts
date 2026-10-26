const mesesCurtos = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

const mesesLongos = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

// "2026-11-10" ou "2026-11-10T00:00:00.000Z" -> { dia: "10", mes: "NOV", mesLongo: "novembro" }
export function partesDaData(date: string) {
  const [, mes, dia] = date.slice(0, 10).split('-');
  const indice = Number(mes) - 1;

  return {
    dia,
    mes: mesesCurtos[indice] ?? '',
    mesLongo: mesesLongos[indice] ?? '',
  };
}

// Data de hoje no fuso do aparelho, como "YYYY-MM-DD"
export function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');

  return `${agora.getFullYear()}-${mes}-${dia}`;
}
