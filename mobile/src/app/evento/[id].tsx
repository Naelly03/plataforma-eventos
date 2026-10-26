import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { EventoCapa } from '@/components/evento-capa';
import { Aviso, ErroDeCarregamento } from '@/components/feedback';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { useInscricoes } from '@/context/inscricoes-context';
import { api, mensagemDoErro } from '@/lib/api';
import { hojeISO, partesDaData } from '@/lib/datas';
import type { Evento } from '@/types/evento';

export default function EventoDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={voltar}
      style={[styles.voltar, { top: insets.top + 8 }]}>
      <Text style={styles.voltarSeta}>←</Text>
    </Pressable>
  );

  if (erro) {
    return (
      <View style={[styles.tela, { paddingTop: insets.top + 8, paddingHorizontal: 20 }]}>
        <Pressable accessibilityRole="button" onPress={voltar}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </Pressable>
        <ErroDeCarregamento mensagem={erro} onTentarNovamente={tentarNovamente} />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.tela}>
        <View style={[styles.capa, { height: 230, backgroundColor: Marca.bordaClara }]} />
        {botaoVoltar}
      </View>
    );
  }

  const { dia, mes, mesLongo } = partesDaData(evento.date);
  const inscrito = Boolean(inscricaoDoEvento(evento.id));
  const jaAconteceu = evento.date.slice(0, 10) < hojeISO();

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.rolagem} showsVerticalScrollIndicator={false}>
        <EventoCapa id={evento.id} imageUrl={evento.imageUrl} altura={230} />

        <View style={styles.folha}>
          <Text style={styles.titulo}>{evento.title}</Text>

          <View style={styles.infos}>
            <View style={styles.info}>
              <View style={[styles.icone, { backgroundColor: Marca.laranjaClaro }]}>
                <Text style={[styles.iconeTexto, { color: Marca.laranjaEscuro, fontSize: 12 }]}>
                  {mes}
                </Text>
              </View>
              <View style={styles.infoTextos}>
                <Text style={styles.infoTitulo}>
                  {dia} de {mesLongo}
                </Text>
                <Text style={styles.infoSub}>{evento.time}</Text>
              </View>
            </View>

            <View style={styles.info}>
              <View style={[styles.icone, { backgroundColor: Marca.azulFundo }]}>
                <Text style={[styles.iconeTexto, { color: Marca.azul }]}>●</Text>
              </View>
              <View style={styles.infoTextos}>
                <Text style={styles.infoTitulo}>{evento.location}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.secao}>Sobre o evento</Text>
          <Text style={styles.descricao}>{evento.description}</Text>

          <View style={[styles.acao, { paddingBottom: Math.max(insets.bottom, 16) }]}>
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
        </View>
      </ScrollView>

      {botaoVoltar}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Marca.fundo,
  },
  rolagem: {
    flexGrow: 1,
  },
  capa: {
    width: '100%',
  },
  voltar: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Marca.branco,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
  },
  voltarSeta: {
    fontFamily: Fonte.negrito,
    fontSize: 20,
    color: Marca.texto,
  },
  voltarTexto: {
    ...Tipo.corpo,
    fontFamily: Fonte.media,
    color: Marca.textoSuave,
  },
  folha: {
    flex: 1,
    marginTop: -28,
    paddingTop: 24,
    paddingHorizontal: 22,
    backgroundColor: Marca.fundo,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  titulo: {
    ...Tipo.h1,
    marginBottom: 14,
    color: Marca.texto,
  },
  infos: {
    gap: 10,
    marginBottom: 18,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: {
    fontFamily: Fonte.extra,
  },
  infoTextos: {
    flex: 1,
  },
  infoTitulo: {
    ...Tipo.corpo,
    fontFamily: Fonte.negrito,
    color: Marca.texto,
  },
  infoSub: {
    ...Tipo.rotulo,
    color: Marca.textoSuave,
  },
  secao: {
    ...Tipo.h3,
    marginBottom: 6,
    color: Marca.texto,
  },
  descricao: {
    ...Tipo.corpo,
    color: Marca.textoMedio,
  },
  acao: {
    marginTop: 'auto',
    paddingTop: 22,
  },
  encerrado: {
    ...Tipo.corpo,
    textAlign: 'center',
    color: Marca.textoSuave,
  },
});
