import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { EventoCapa } from '@/components/evento-capa';
import { Aviso, ErroDeCarregamento } from '@/components/feedback';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { useInscricoes } from '@/context/inscricoes-context';
import { api, mensagemDoErro } from '@/lib/api';
import { dataCurta, hojeISO } from '@/lib/datas';
import type { Evento } from '@/types/evento';

export default function EventoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { inscricaoDoEvento, inscrever, cancelar } = useInscricoes();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [processando, setProcessando] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let ativo = true;

    api<Evento>(`/api/events/${id}`)
      .then((dados) => {
        if (ativo) setEvento(dados);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(mensagemDoErro(err, 'Verifique sua conexão e tente novamente.'));
      });

    return () => {
      ativo = false;
    };
  }, [id, tentativa]);

  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace('/eventos');
  }

  function tentarNovamente() {
    setErro('');
    setTentativa((atual) => atual + 1);
  }

  async function alternarInscricao() {
    if (!evento) return;

    setAviso('');
    setProcessando(true);

    try {
      const inscricao = inscricaoDoEvento(evento.id);

      if (inscricao) await cancelar(inscricao.id);
      else await inscrever(evento);
    } catch (err) {
      setAviso(mensagemDoErro(err, 'Não foi possível atualizar a inscrição.'));
    } finally {
      setProcessando(false);
    }
  }

  const botaoVoltar = (
    <Pressable accessibilityRole="button" onPress={voltar} style={styles.voltar}>
      <Text style={styles.voltarTexto}>← Voltar</Text>
    </Pressable>
  );

  const inscrito = evento ? Boolean(inscricaoDoEvento(evento.id)) : false;
  const jaAconteceu = evento ? evento.date.slice(0, 10) < hojeISO() : false;

  return (
    <SafeAreaView style={styles.tela}>
      {botaoVoltar}

      {erro ? (
        <View style={styles.padding}>
          <ErroDeCarregamento mensagem={erro} onTentarNovamente={tentarNovamente} />
        </View>
      ) : !evento ? (
        <ActivityIndicator color={Marca.laranja} style={styles.carregando} />
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo}>
          <EventoCapa imageUrl={evento.imageUrl} altura={200} style={styles.capa} />

          <Text style={styles.titulo}>{evento.title}</Text>

          <Text style={styles.rotulo}>Data</Text>
          <Text style={styles.valor}>{dataCurta(evento.date)}</Text>

          <Text style={styles.rotulo}>Horário</Text>
          <Text style={styles.valor}>{evento.time}</Text>

          <Text style={styles.rotulo}>Local</Text>
          <Text style={styles.valor}>{evento.location}</Text>

          <Text style={styles.rotulo}>Descrição</Text>
          <Text style={styles.descricao}>{evento.description}</Text>

          <View style={styles.acao}>
            {aviso ? <Aviso texto={aviso} /> : null}

            {jaAconteceu && !inscrito ? (
              <Text style={styles.encerrado}>Este evento já aconteceu.</Text>
            ) : (
              <Botao
                titulo={inscrito ? 'Cancelar inscrição' : 'Inscrever-se'}
                variante={inscrito ? 'perigo' : 'primario'}
                carregando={processando}
                onPress={() => void alternarInscricao()}
              />
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Marca.fundo,
  },
  padding: {
    paddingHorizontal: 20,
  },
  carregando: {
    marginTop: 40,
  },
  voltar: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  voltarTexto: {
    ...Tipo.corpo,
    fontFamily: Fonte.media,
    color: Marca.textoSuave,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  capa: {
    borderRadius: 12,
    marginBottom: 16,
  },
  titulo: {
    ...Tipo.h1,
    marginBottom: 12,
    color: Marca.texto,
  },
  rotulo: {
    ...Tipo.rotulo,
    marginTop: 10,
    color: Marca.textoSuave,
  },
  valor: {
    ...Tipo.corpo,
    fontFamily: Fonte.negrito,
    color: Marca.texto,
  },
  descricao: {
    ...Tipo.corpo,
    color: Marca.textoMedio,
  },
  acao: {
    paddingTop: 24,
  },
  encerrado: {
    ...Tipo.corpo,
    textAlign: 'center',
    color: Marca.textoSuave,
  },
});
