export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ErroDaApi = { error?: string | string[] };

// Chama a API. A sessão vai no cookie (HttpOnly) que o Better Auth define, e o
// navegador o envia sozinho. Em 401 a sessão expirou: volta para o login.
export async function api<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(path, { ...init, headers });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Recarga completa em /login (de propósito, não um push do router): assim a
    // sessão em cache do Better Auth é descartada e consultada de novo no servidor.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (response.status === 401) window.location.assign("/login");

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
