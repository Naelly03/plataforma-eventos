import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EventoCapa } from '@/components/evento-capa';
import { Marca } from '@/constants/marca';
import { Tipo } from '@/constants/tipografia';
import { dataCurta } from '@/lib/datas';
import type { Evento } from '@/types/evento';

type EventoCardProps = {
  evento: Evento;
  inscrito: boolean;
  onPress: () => void;
};

export function EventoCard({ evento, inscrito, onPress }: EventoCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${evento.title}, ${dataCurta(evento.date)}, ${evento.time}, ${evento.location}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}>
      <EventoCapa imageUrl={evento.imageUrl} altura={120} />

      <View style={styles.corpo}>
        <Text style={styles.titulo} numberOfLines={2}>
          {evento.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {dataCurta(evento.date)} · {evento.time} · {evento.location}
        </Text>
        {inscrito ? <Text style={styles.inscrito}>Inscrito</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Marca.branco,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Marca.bordaClara,
  },
  pressionado: {
    opacity: 0.9,
  },
  corpo: {
    padding: 14,
    gap: 4,
  },
  titulo: {
    ...Tipo.h3,
    color: Marca.texto,
  },
  meta: {
    ...Tipo.rotulo,
    color: Marca.textoSuave,
  },
  inscrito: {
    ...Tipo.rotulo,
    color: Marca.sucesso,
  },
});
