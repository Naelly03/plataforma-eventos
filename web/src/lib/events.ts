import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  description: z.string().min(1, "Descrição obrigatória"),
  date: z.coerce.date({ error: "Data inválida" }),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário deve estar no formato HH:mm"),
  location: z.string().min(1, "Local obrigatório"),
  imageUrl: z.url("URL da imagem inválida"),
});

export const withRegistrationsCount = {
  _count: { select: { registrations: true } },
} as const;

export function serializeEvent<T extends { _count: { registrations: number } }>(
  event: T
) {
  const { _count: count, ...rest } = event;
  return { ...rest, registrationsCount: count.registrations };
}
