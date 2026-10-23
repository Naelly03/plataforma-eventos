
export type Evento = {
  id: number;
  titulo: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  descricao: string;
};

export const eventosIniciais: Evento[] = [
  {
    id: 1,
    titulo: "Tech Summit",
    categoria: "Tecnologia",
    data: "15/11/2026",
    horario: "09:00",
    local: "Teresina, PI",
    descricao: "Um encontro sobre tecnologia e inovação.",
  },
  {
    id: 2,
    titulo: "Dev Experience",
    categoria: "Desenvolvimento",
    data: "22/11/2026",
    horario: "14:30",
    local: "Teresina, PI",
    descricao: "Compartilhamento de experiências em desenvolvimento.",
  },
  {
    id: 3,
    titulo: "Innovation Day",
    categoria: "Inovação",
    data: "05/12/2026",
    horario: "19:00",
    local: "Teresina, PI",
    descricao: "Ideias e soluções para o futuro.",
  },
];
