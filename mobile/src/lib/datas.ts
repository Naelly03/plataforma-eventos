// "2026-11-10" ou "2026-11-10T00:00:00.000Z" -> "10/11/2026"
export function dataCurta(date: string) {
  const [ano, mes, dia] = date.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// Data de hoje no fuso do aparelho, como "YYYY-MM-DD"
export function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');

  return `${agora.getFullYear()}-${mes}-${dia}`;
}
