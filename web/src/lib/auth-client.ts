import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

type ErroDeAuth = { code?: string; message?: string; status?: number };

export function mensagemDeAuth(error: ErroDeAuth | null | undefined, padrao: string) {
  if (!error) return padrao;

  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Credenciais inválidas";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "E-mail já cadastrado";
    case "PASSWORD_TOO_SHORT":
      return "A senha precisa ter ao menos 6 caracteres";
    case "INVALID_EMAIL":
      return "E-mail inválido";
  }

  if (error.status === 429) {
    return "Muitas tentativas. Aguarde alguns segundos e tente de novo.";
  }

  return padrao;
}
