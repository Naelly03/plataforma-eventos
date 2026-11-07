import { API_URL } from '@/lib/config';

export class ApiError extends Error {
  status: number;
  // código do Better Auth (ex.: INVALID_EMAIL_OR_PASSWORD), quando houver
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
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

// Nossas rotas respondem { error }; as do Better Auth, { code, message }
type ErroDaApi = { error?: string | string[]; message?: string; code?: string };

// Igual a api(), mas devolve também os headers (o login precisa ler o
// set-auth-token, que traz o token da sessão)
export async function apiComResposta<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = handlers.getToken();

  if (init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;

  try {
    // `omit`: o app autentica só pelo header Authorization. Sem isso o sistema
    // guardaria o cookie de sessão do Better Auth no aparelho e o reenviaria,
    // e o servidor recusaria o logout (POST com cookie e sem Origin).
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: 'omit',
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão.',
      0,
    );
  }

  if (response.status === 204) {
    return { data: undefined as T, headers: response.headers };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // 401 com sessão ativa = token expirado; no login (sem token) é só senha errada
    if (response.status === 401 && token) handlers.onUnauthorized();

    const { error, message, code } = (data ?? {}) as ErroDaApi;
    const texto = Array.isArray(error) ? error.join(' ') : (error ?? message);

    throw new ApiError(
      texto || 'Não foi possível concluir a requisição.',
      response.status,
      code,
    );
  }

  return { data: data as T, headers: response.headers };
}

export async function api<T>(path: string, init: RequestInit = {}) {
  const { data } = await apiComResposta<T>(path, init);
  return data;
}

export function mensagemDoErro(err: unknown, padrao: string) {
  return err instanceof Error && err.message ? err.message : padrao;
}
