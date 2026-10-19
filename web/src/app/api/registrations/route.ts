import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    where: { userId: auth.userId },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(registrations);
}
