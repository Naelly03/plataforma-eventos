import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { eventSchema } from "@/lib/events";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });

// P2025 = registro não encontrado no update/delete do Prisma
const isNotFound = (e: unknown) => (e as { code?: string })?.code === "P2025";

export async function GET(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return notFound();

  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (auth.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 });
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
  try {
    const event = await prisma.event.update({ where: { id }, data: parsed.data });
    return NextResponse.json(event);
  } catch (e) {
    if (isNotFound(e)) return notFound();
    throw e;
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (auth.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.event.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (isNotFound(e)) return notFound();
    throw e;
  }
}
