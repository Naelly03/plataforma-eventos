// Mesmo formato do model Event da API (date vem como ISO)
export type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  ownerId: string;
  // só vem em /api/events; na lista de inscrições o evento não traz a contagem
  registrationsCount?: number;
};

export type Inscricao = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
};

export type InscricaoComEvento = Inscricao & { event: Evento };
