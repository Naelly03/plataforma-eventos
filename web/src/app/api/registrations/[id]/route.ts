import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Ctx) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const registration = await prisma.registration.findUnique({ where: { id } });
  if (!registration) {
    return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
  }

  // só o dono cancela (nem ADMIN cancela inscrição de outro usuário)
  if (registration.userId !== auth.userId) {
    return NextResponse.json({ error: "Você não pode cancelar esta inscrição" }, { status: 403 });
  }

  await prisma.registration.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
