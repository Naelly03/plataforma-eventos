import { API_URL } from '@/lib/config';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Handlers = {
  getToken: () => string | null;
  onUnauthorized: () => void;
};

let handlers: Handlers = { getToken: () => null, onUnauthorized: () => {} };

// O AuthProvider informa como obter o token e o que fazer quando ele expira
export function configurarApi(novos: Handlers) {
  handlers = novos;
}

type ErroDaApi = { error?: string | string[] };

export async function api<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = handlers.getToken();

  if (init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão.',
      0,
    );
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // 401 com sessão ativa = token expirado; no login (sem token) é só senha errada
    if (response.status === 401 && token) handlers.onUnauthorized();

    const { error } = (data ?? {}) as ErroDaApi;
    const mensagem = Array.isArray(error) ? error.join(' ') : error;

    throw new ApiError(
      mensagem || 'Não foi possível concluir a requisição.',
      response.status,
    );
  }

  return data as T;
}

export function mensagemDoErro(err: unknown, padrao: string) {
  return err instanceof Error && err.message ? err.message : padrao;
}
