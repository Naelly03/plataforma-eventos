export type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  ownerId: string;
  registrationsCount?: number;
};

export type Inscricao = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
};

export type InscricaoComEvento = Inscricao & { event: Evento };
