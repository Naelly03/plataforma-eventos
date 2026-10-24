import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { eventSchema, serializeEvent, withRegistrationsCount } from "@/lib/events";

// P2003 = chave estrangeira inexistente (token válido, mas o usuário não existe mais)
const prismaCode = (e: unknown) => (e as { code?: string })?.code;

export async function GET(req: Request) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: withRegistrationsCount,
  });
  return NextResponse.json(events.map(serializeEvent));
}

// Qualquer usuário logado cria eventos e passa a ser o organizador (owner) deles
export async function POST(req: Request) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const event = await prisma.event.create({
      data: { ...parsed.data, ownerId: auth.userId },
      include: withRegistrationsCount,
    });
    return NextResponse.json(serializeEvent(event), { status: 201 });
  } catch (e) {
    if (prismaCode(e) === "P2003") {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }
    throw e;
  }
}
