import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { useAuth } from '@/context/auth-context';
import { api, mensagemDoErro } from '@/lib/api';
import type { Evento, Inscricao, InscricaoComEvento } from '@/types/evento';

type InscricoesContextValue = {
  inscricoes: InscricaoComEvento[];
  carregando: boolean;
  erro: string;
  recarregar: () => void;
  inscricaoDoEvento: (eventoId: string) => InscricaoComEvento | undefined;
  inscrever: (evento: Evento) => Promise<void>;
  cancelar: (inscricaoId: string) => Promise<void>;
};

const InscricoesContext = createContext<InscricoesContextValue | null>(null);

// Guarda as inscrições do usuário para a lista, os detalhes e "Minhas inscrições"
// ficarem sempre iguais. Deve ser montado com `key` do usuário, para que a
// troca de conta comece com o estado limpo.
export function InscricoesProvider({ children }: PropsWithChildren) {
  const { token } = useAuth();

  const [inscricoes, setInscricoes] = useState<InscricaoComEvento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!token) return;

    let ativo = true;

    api<InscricaoComEvento[]>('/api/registrations')
      .then((lista) => {
        if (!ativo) return;
        setInscricoes(lista);
        setErro('');
        setCarregando(false);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(mensagemDoErro(err, 'Não foi possível carregar suas inscrições.'));
        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [token, tentativa]);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setErro('');
    setTentativa((atual) => atual + 1);
  }, []);

  const inscricaoDoEvento = useCallback(
    (eventoId: string) => inscricoes.find((item) => item.eventId === eventoId),
    [inscricoes],
  );

  const inscrever = useCallback(async (evento: Evento) => {
    const inscricao = await api<Inscricao>(
      `/api/events/${evento.id}/registrations`,
      { method: 'POST' },
    );

    setInscricoes((atuais) => [{ ...inscricao, event: evento }, ...atuais]);
  }, []);

  const cancelar = useCallback(async (inscricaoId: string) => {
    await api<void>(`/api/registrations/${inscricaoId}`, { method: 'DELETE' });

    setInscricoes((atuais) => atuais.filter((item) => item.id !== inscricaoId));
  }, []);

  const value = useMemo(
    () => ({
      inscricoes,
      carregando,
      erro,
      recarregar,
      inscricaoDoEvento,
      inscrever,
      cancelar,
    }),
    [inscricoes, carregando, erro, recarregar, inscricaoDoEvento, inscrever, cancelar],
  );

  return (
    <InscricoesContext.Provider value={value}>
      {children}
    </InscricoesContext.Provider>
  );
}

export function useInscricoes() {
  const context = useContext(InscricoesContext);

  if (!context) {
    throw new Error('useInscricoes deve ser usado dentro de um InscricoesProvider');
  }

  return context;
}
