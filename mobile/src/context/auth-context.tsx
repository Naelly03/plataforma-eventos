import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { ApiError, api, apiComResposta, configurarApi } from '@/lib/api';
import { storage } from '@/lib/storage';
import type { Usuario } from '@/types/usuario';

const TOKEN_KEY = 'agendou_token';
const USER_KEY = 'agendou_user';

type AuthContextValue = {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const mensagensDeAuth: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Credenciais inválidas',
  USER_ALREADY_EXISTS: 'E-mail já cadastrado',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'E-mail já cadastrado',
  PASSWORD_TOO_SHORT: 'A senha precisa ter ao menos 6 caracteres',
  INVALID_EMAIL: 'E-mail inválido',
};

function traduzirErro(err: unknown): never {
  if (err instanceof ApiError) {
    const mensagem =
      (err.code && mensagensDeAuth[err.code]) ||
      (err.status === 429
        ? 'Muitas tentativas. Aguarde alguns segundos e tente de novo.'
        : null);

    if (mensagem) throw new ApiError(mensagem, err.status, err.code);
  }

  throw err;
}

type UsuarioDaApi = { id: string; name: string; email: string; role?: string };

function usuarioDe(user: UsuarioDaApi): Usuario {
  return { id: user.id, name: user.name, email: user.email, role: user.role ?? 'USER' };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const guardarSessao = useCallback(async (novoToken: string, user: Usuario) => {
    tokenRef.current = novoToken;
    setToken(novoToken);
    setUsuario(user);
    await storage.salvar(TOKEN_KEY, novoToken);
    await storage.salvar(USER_KEY, JSON.stringify(user));
  }, []);

  const limparSessao = useCallback(async () => {
    tokenRef.current = null;
    setToken(null);
    setUsuario(null);
    await storage.remover(TOKEN_KEY);
    await storage.remover(USER_KEY);
  }, []);

  useEffect(() => {
    configurarApi({
      getToken: () => tokenRef.current,
      onUnauthorized: () => void limparSessao(),
    });
  }, [limparSessao]);

  useEffect(() => {
    let ativo = true;

    async function restaurar() {
      const [tokenSalvo, usuarioSalvo] = await Promise.all([
        storage.ler(TOKEN_KEY),
        storage.ler(USER_KEY),
      ]);

      if (!ativo) return;

      if (tokenSalvo && usuarioSalvo) {
        try {
          setUsuario(JSON.parse(usuarioSalvo) as Usuario);
          tokenRef.current = tokenSalvo;
          setToken(tokenSalvo);
        } catch {
        }
      }

      setCarregando(false);
    }

    void restaurar();

    return () => {
      ativo = false;
    };
  }, []);

  const abrirSessao = useCallback(
    async (path: string, corpo: object) => {
      try {
        const { data, headers } = await apiComResposta<{ user: UsuarioDaApi }>(
          path,
          { method: 'POST', body: JSON.stringify(corpo) },
        );

        const novoToken = headers.get('set-auth-token');
        if (!novoToken) throw new Error('O servidor não retornou o token.');

        await guardarSessao(novoToken, usuarioDe(data.user));
      } catch (err) {
        traduzirErro(err);
      }
    },
    [guardarSessao],
  );

  const entrar = useCallback(
    (email: string, senha: string) =>
      abrirSessao('/api/auth/sign-in/email', { email, password: senha }),
    [abrirSessao],
  );

  const cadastrar = useCallback(
    (nome: string, email: string, senha: string) =>
      abrirSessao('/api/auth/sign-up/email', {
        name: nome,
        email,
        password: senha,
      }),
    [abrirSessao],
  );

  const sair = useCallback(async () => {
    try {
      await api<unknown>('/api/auth/sign-out', { method: 'POST', body: '{}' });
    } catch {
    }

    await limparSessao();
  }, [limparSessao]);

  const value = useMemo(
    () => ({ usuario, token, carregando, entrar, cadastrar, sair }),
    [usuario, token, carregando, entrar, cadastrar, sair],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
