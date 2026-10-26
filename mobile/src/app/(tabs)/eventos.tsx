import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventoCard } from '@/components/evento-card';
import { ErroDeCarregamento, EsqueletoDeCards, EstadoVazio } from '@/components/feedback';
import { Marca } from '@/constants/marca';
import { Tipo } from '@/constants/tipografia';
import { useInscricoes } from '@/context/inscricoes-context';
import { api, mensagemDoErro } from '@/lib/api';
import { hojeISO } from '@/lib/datas';
import type { Evento } from '@/types/evento';

export default function EventosScreen() {
  const router = useRouter();
  const { inscricaoDoEvento } = useInscricoes();

  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [erro, setErro] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    api<Evento[]>('/api/events')
      .then((lista) => {
        if (!ativo) return;
        setEventos(lista);
        setErro('');
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(mensagemDoErro(err, 'Verifique sua conexão e tente novamente.'));
      })
      .finally(() => {
        if (ativo) setAtualizando(false);
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  function recarregar(porGesto = false) {
    if (porGesto) setAtualizando(true);
    setErro('');
    setTentativa((atual) => atual + 1);
  }

  const hoje = hojeISO();
  const proximos = (eventos ?? []).filter((evento) => evento.date.slice(0, 10) >= hoje);

  const carregando = eventos === null && !erro;

  return (
    <SafeAreaView edges={['top']} style={styles.tela}>
      <FlatList
        data={erro && eventos === null ? [] : proximos}
        keyExtractor={(evento) => evento.id}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => recarregar(true)}
            tintColor={Marca.laranja}
            colors={[Marca.laranja]}
          />
        }
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Eventos</Text>
            <Text style={styles.subtitulo}>Descubra e inscreva-se.</Text>
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <EsqueletoDeCards />
          ) : erro ? (
            <ErroDeCarregamento mensagem={erro} onTentarNovamente={() => recarregar()} />
          ) : (
            <EstadoVazio texto="Nenhum evento disponível no momento." />
          )
        }
        renderItem={({ item }) => (
          <EventoCard
            evento={item}
            inscrito={Boolean(inscricaoDoEvento(item.id))}
            onPress={() => router.push(`/evento/${item.id}`)}
          />
        )}
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
    height: 16,
  },
});
