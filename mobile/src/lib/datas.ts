export function dataCurta(date: string) {
  const [ano, mes, dia] = date.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');

  return `${agora.getFullYear()}-${mes}-${dia}`;
}
