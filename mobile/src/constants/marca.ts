// Cores e gradientes do Agendou, tirados do design do app
export const Marca = {
  laranja: '#ea580c',
  laranjaEscuro: '#c2410c',
  laranjaClaro: '#fff1e6',
  fundo: '#f8fafc',
  branco: '#ffffff',
  texto: '#1e293b',
  textoSuave: '#64748b',
  textoMedio: '#475569',
  borda: '#cbd5e1',
  bordaClara: '#e2e8f0',
  noite: '#0f172a',
  perigo: '#dc2626',
  perigoFundo: '#fef2f2',
  perigoBorda: '#fecaca',
  sucesso: '#15803d',
  sucessoFundo: '#dcfce7',
  azul: '#2563eb',
  azulFundo: '#eff6ff',
} as const;

export const GradienteLaranja = 'linear-gradient(90deg, #c2410c, #ea580c)';

// A API não tem cor de capa; cada evento ganha uma, sempre a mesma
const gradientesDeEvento = [
  'linear-gradient(135deg, #c2410c, #ea580c)',
  'linear-gradient(135deg, #7c1fd6, #c2410c)',
  'linear-gradient(135deg, #2563eb, #7c1fd6)',
  'linear-gradient(135deg, #166534, #2563eb)',
];

export function gradienteDoEvento(id: string) {
  let soma = 0;
  for (let i = 0; i < id.length; i++) soma += id.charCodeAt(i);

  return gradientesDeEvento[soma % gradientesDeEvento.length];
}
