import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { Aviso, ErroDeCarregamento, EsqueletoDeCards, EstadoVazio } from '@/components/feedback';
import { Marca, gradienteDoEvento } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { useInscricoes } from '@/context/inscricoes-context';
import { mensagemDoErro } from '@/lib/api';
import { partesDaData } from '@/lib/datas';

export default function InscricoesScreen() {
  const router = useRouter();
  const { inscricoes, carregando, erro, recarregar, cancelar } = useInscricoes();

  const [cancelando, setCancelando] = useState<string[]>([]);
  const [aviso, setAviso] = useState('');

  async function cancelarInscricao(inscricaoId: string) {
    setAviso('');
    setCancelando((atuais) => [...atuais, inscricaoId]);

    try {
      await cancelar(inscricaoId);
    } catch (err) {
      setAviso(mensagemDoErro(err, 'Não foi possível cancelar a inscrição.'));
    } finally {
      setCancelando((atuais) => atuais.filter((id) => id !== inscricaoId));
    }
  }

  const total = inscricoes.length;
  const semDados = carregando && total === 0;

  return (
    <SafeAreaView edges={['top']} style={styles.tela}>
      <FlatList
        data={erro && total === 0 ? [] : inscricoes}
        keyExtractor={(inscricao) => inscricao.id}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        refreshControl={
          <RefreshControl
            refreshing={carregando && total > 0}
            onRefresh={recarregar}
            tintColor={Marca.laranja}
            colors={[Marca.laranja]}
          />
        }
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Minhas inscrições</Text>
            <Text style={styles.subtitulo}>
              {total === 1 ? '1 evento confirmado.' : `${total} eventos confirmados.`}
            </Text>
            {aviso ? <Aviso texto={aviso} /> : null}
          </View>
        }
        ListEmptyComponent={
          semDados ? (
            <EsqueletoDeCards quantidade={2} />
          ) : erro ? (
            <ErroDeCarregamento mensagem={erro} onTentarNovamente={recarregar} />
          ) : (
            <EstadoVazio texto="Você ainda não está inscrito em nenhum evento." />
          )
        }
        renderItem={({ item }) => {
          const { event: evento } = item;
          const { dia, mes } = partesDaData(evento.date);

          return (
            <View style={styles.card}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ver ${evento.title}`}
                onPress={() => router.push(`/evento/${evento.id}`)}
                style={styles.linhaEvento}>
                <View
                  style={[
                    styles.data,
                    { experimental_backgroundImage: gradienteDoEvento(evento.id) },
                  ]}>
                  <Text style={styles.dataDia}>{dia}</Text>
                  <Text style={styles.dataMes}>{mes}</Text>
                </View>

                <View style={styles.textos}>
                  <Text style={styles.nome} numberOfLines={2}>
                    {evento.title}
                  </Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {evento.time} · {evento.location}
                  </Text>
                </View>
              </Pressable>

              <Botao
                titulo="Cancelar inscrição"
                variante="perigo"
                altura={42}
                carregando={cancelando.includes(item.id)}
                onPress={() => void cancelarInscricao(item.id)}
                style={styles.botaoCancelar}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Marca.fundo,
  },
  lista: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cabecalho: {
    marginBottom: 18,
  },
  titulo: {
    ...Tipo.h1,
    marginTop: 8,
    marginBottom: 4,
    color: Marca.texto,
  },
  subtitulo: {
    ...Tipo.corpo,
    color: Marca.textoSuave,
  },
  separador: {
    height: 14,
  },
  card: {
    gap: 12,
    padding: 14,
    backgroundColor: Marca.branco,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Marca.bordaClara,
  },
  linhaEvento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  data: {
    width: 56,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataDia: {
    fontFamily: Fonte.extra,
    fontSize: 20,
    lineHeight: 22,
    color: Marca.branco,
    fontVariant: ['tabular-nums'],
  },
  dataMes: {
    fontFamily: Fonte.negrito,
    fontSize: 12,
    letterSpacing: 1,
    color: Marca.branco,
  },
  textos: {
    flex: 1,
  },
  nome: {
    ...Tipo.h3,
    color: Marca.texto,
  },
  meta: {
    ...Tipo.rotulo,
    color: Marca.textoSuave,
  },
  botaoCancelar: {
    borderRadius: 12,
    boxShadow: undefined,
  },
});
