import { lerToken, limparSessao } from "@/lib/session";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ErroDaApi = { error?: string | string[] };

// Chama a API com o token da sessão. Em 401 encerra a sessão (a guarda de
// rota do shell leva o usuário ao login).
export async function api<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = lerToken();

  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...init, headers });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) limparSessao();

    const { error } = (data ?? {}) as ErroDaApi;
    const mensagem = Array.isArray(error) ? error.join(" ") : error;

    throw new ApiError(
      mensagem || "Não foi possível concluir a requisição.",
      response.status,
    );
  }

  return data as T;
}

export function mensagemDoErro(err: unknown, padrao: string) {
  return err instanceof Error && err.message ? err.message : padrao;
}
