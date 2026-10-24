import { iniciarSessao, type Usuario } from "@/lib/session";

export const authCardClass =
  "w-full max-w-[420px] rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_20px_40px_-12px_rgba(15,23,42,0.12)] sm:p-9";

export const authTitleClass =
  "mb-1.5 text-[32px] font-extrabold leading-tight tracking-[-0.005em]";

export const authLabelClass = "mb-1.5 block text-sm font-medium";

export const authInputClass =
  "h-[46px] w-full rounded-[10px] border border-slate-300 bg-white px-3.5 text-base outline-none transition focus:border-orange-700 focus:ring-[3px] focus:ring-orange-600/20";

export const authButtonClass =
  "h-12 w-full rounded-[10px] bg-linear-to-r from-orange-700 to-orange-600 text-base font-bold text-white shadow-[0_6px_16px_rgba(194,65,12,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";

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
