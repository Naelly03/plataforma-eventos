import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type Role = "ADMIN" | "USER";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // Mantém o bcrypt: as senhas já cadastradas continuam valendo
    password: {
      hash: (password) => bcrypt.hash(password, 10),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },

  user: {
    additionalFields: {
      // input: false => o cliente não consegue se cadastrar como ADMIN
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },

  session: { expiresIn: 60 * 60 * 24 * 7 }, // 7 dias

  // O app mobile envia "Authorization: Bearer <token>"; o web usa cookie
  plugins: [bearer()],
});

// Devolve o usuário logado (ou null). Aceita o cookie de sessão (web) e o
// header "Authorization: Bearer <token>" (mobile).
export async function getAuth(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  return { userId: session.user.id, role: session.user.role as Role };
}
