import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { eventSchema, serializeEvent, withRegistrationsCount } from "@/lib/events";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });

const notOwner = () =>
  NextResponse.json({ error: "Apenas o organizador pode alterar este evento" }, { status: 403 });

export async function GET(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: withRegistrationsCount,
  });
  if (!event) return notFound();

  return NextResponse.json(serializeEvent(event));
}

// Editar e excluir: só o organizador do evento (nem ADMIN altera evento de outro)
export async function PUT(req: Request, { params }: Ctx) {
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

  const { id } = await params;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return notFound();
  if (existing.ownerId !== auth.userId) return notOwner();

  const event = await prisma.event.update({
    where: { id },
    data: parsed.data,
    include: withRegistrationsCount,
  });
  return NextResponse.json(serializeEvent(event));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return notFound();
  if (existing.ownerId !== auth.userId) return notOwner();

  await prisma.event.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
