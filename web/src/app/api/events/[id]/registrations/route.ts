import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

// P2002 = violação de unique (userId + eventId), P2003 = chave estrangeira inexistente
const prismaCode = (e: unknown) => (e as { code?: string })?.code;

// Lista de inscritos: só o organizador do evento
export async function GET(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }
  if (event.ownerId !== auth.userId) {
    return NextResponse.json(
      { error: "Apenas o organizador pode ver os inscritos" },
      { status: 403 }
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(registrations);
}

export async function POST(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  try {
    const registration = await prisma.registration.create({
      data: { userId: auth.userId, eventId },
    });
    return NextResponse.json(registration, { status: 201 });
  } catch (e) {
    if (prismaCode(e) === "P2002") {
      return NextResponse.json({ error: "Você já está inscrito neste evento" }, { status: 409 });
    }
    // token válido mas o usuário não existe mais
    if (prismaCode(e) === "P2003") {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }
    throw e;
  }
}
