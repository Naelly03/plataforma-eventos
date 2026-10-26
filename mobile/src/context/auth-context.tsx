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

import { api, configurarApi } from '@/lib/api';
import { storage } from '@/lib/storage';
import type { RespostaDeAuth, Usuario } from '@/types/usuario';

const TOKEN_KEY = 'agendou_token';
const USER_KEY = 'agendou_user';

type AuthContextValue = {
  usuario: Usuario | null;
  token: string | null;
  // true enquanto a sessão salva no aparelho ainda está sendo lida
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const guardarSessao = useCallback(async (resposta: RespostaDeAuth) => {
    tokenRef.current = resposta.token;
    setToken(resposta.token);
    setUsuario(resposta.user);
    await storage.salvar(TOKEN_KEY, resposta.token);
    await storage.salvar(USER_KEY, JSON.stringify(resposta.user));
  }, []);

  const sair = useCallback(async () => {
    tokenRef.current = null;
    setToken(null);
    setUsuario(null);
    await storage.remover(TOKEN_KEY);
    await storage.remover(USER_KEY);
  }, []);

  // Em 401 com sessão ativa o token expirou: encerra a sessão
  useEffect(() => {
    configurarApi({
      getToken: () => tokenRef.current,
      onUnauthorized: () => void sair(),
    });
  }, [sair]);

  // Mantém o usuário autenticado entre aberturas do app
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
          // usuário salvo corrompido: segue sem sessão
        }
      }

      setCarregando(false);
    }

    void restaurar();

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(
    async (email: string, senha: string) => {
      const resposta = await api<RespostaDeAuth>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: senha }),
      });

      await guardarSessao(resposta);
    },
    [guardarSessao],
  );

  const cadastrar = useCallback(
    async (nome: string, email: string, senha: string) => {
      await api<Usuario>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: nome, email, password: senha }),
      });

      // a conta recém-criada já entra
      await entrar(email, senha);
    },
    [entrar],
  );

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
