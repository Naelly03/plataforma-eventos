import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EventoCapa } from '@/components/evento-capa';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { partesDaData } from '@/lib/datas';
import type { Evento } from '@/types/evento';

type EventoCardProps = {
  evento: Evento;
  inscrito: boolean;
  onPress: () => void;
};

export function EventoCard({ evento, inscrito, onPress }: EventoCardProps) {
  const { dia, mes } = partesDaData(evento.date);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${evento.title}, ${dia} de ${mes}, ${evento.time}, ${evento.location}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}>
      <EventoCapa id={evento.id} imageUrl={evento.imageUrl} altura={120}>
        <View style={styles.chipData}>
          <Text style={styles.chipDia}>{dia}</Text>
          <Text style={styles.chipMes}>{mes}</Text>
        </View>

        {inscrito && (
          <View style={styles.chipInscrito}>
            <Text style={styles.chipInscritoTexto}>Inscrito</Text>
          </View>
        )}
      </EventoCapa>

      <View style={styles.corpo}>
        <Text style={styles.titulo} numberOfLines={2}>
          {evento.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {evento.time} · {evento.location}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Marca.branco,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Marca.bordaClara,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  },
  pressionado: {
    opacity: 0.9,
  },
  chipData: {
    position: 'absolute',
    left: 14,
    top: 14,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Marca.branco,
  },
  chipDia: {
    fontFamily: Fonte.extra,
    fontSize: 18,
    lineHeight: 20,
    color: Marca.texto,
    fontVariant: ['tabular-nums'],
  },
  chipMes: {
    fontFamily: Fonte.negrito,
    fontSize: 12,
    letterSpacing: 1,
    color: Marca.laranjaEscuro,
  },
  chipInscrito: {
    position: 'absolute',
    right: 14,
    top: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: Marca.sucessoFundo,
  },
  chipInscritoTexto: {
    ...Tipo.rotulo,
    color: Marca.sucesso,
  },
  corpo: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titulo: {
    ...Tipo.h3,
    color: Marca.texto,
    marginBottom: 4,
  },
  meta: {
    ...Tipo.rotulo,
    color: Marca.textoSuave,
  },
});
