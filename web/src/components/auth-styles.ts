import { iniciarSessao, type Usuario } from "@/lib/session";

export const authCardClass =
  "w-full max-w-[420px] rounded-xl border border-slate-200 bg-white p-6 sm:p-8";

export const authTitleClass =
  "mb-1.5 type-h2";

export const authLabelClass = "mb-1.5 block type-label";

export const authInputClass =
  "h-[46px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-base outline-none transition focus:border-orange-700 focus:ring-[3px] focus:ring-orange-600/20";

export const authButtonClass =
  "h-12 w-full rounded-lg bg-[#EA580C] type-button text-white transition hover:bg-[#C2410C] disabled:cursor-not-allowed disabled:opacity-60";

export const authLinkClass =
  "font-medium text-blue-600 no-underline hover:text-blue-700";

export type AuthResponse = {
  token?: string;
  user?: Usuario;
  error?: string | string[];
};

export function mensagemDeErro(error: AuthResponse["error"], padrao: string) {
  if (Array.isArray(error)) return error.join(" ");
  return error || padrao;
}

export function salvarSessao(data: AuthResponse) {
  if (!data.token) {
    throw new Error("O servidor não retornou o token.");
  }

  iniciarSessao(data.token, data.user);
}
