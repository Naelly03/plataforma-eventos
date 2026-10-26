import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { GradienteLaranja, Marca } from '@/constants/marca';
import { Tipo } from '@/constants/tipografia';

type BotaoProps = {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'contorno' | 'claro' | 'perigo';
  carregando?: boolean;
  altura?: number;
  style?: StyleProp<ViewStyle>;
};

const variantes = {
  primario: {
    botao: {
      experimental_backgroundImage: GradienteLaranja,
      boxShadow: '0 8px 20px rgba(194, 65, 12, 0.28)',
    },
    texto: Marca.branco,
  },
  contorno: {
    botao: { borderWidth: 1, borderColor: Marca.borda },
    texto: Marca.texto,
  },
  claro: {
    botao: { borderWidth: 1, borderColor: '#475569' },
    texto: Marca.branco,
  },
  perigo: {
    botao: {
      backgroundColor: Marca.branco,
      borderWidth: 1,
      borderColor: Marca.perigoBorda,
    },
    texto: Marca.perigo,
  },
} as const;

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  carregando = false,
  altura = 54,
  style,
}: BotaoProps) {
  const estilo = variantes[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: carregando, busy: carregando }}
      disabled={carregando}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        { height: altura },
        estilo.botao,
        (pressed || carregando) && styles.apagado,
        style,
      ]}>
      {carregando ? (
        <ActivityIndicator color={estilo.texto} />
      ) : (
        <Text style={[styles.texto, { color: estilo.texto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  texto: {
    ...Tipo.botao,
  },
  apagado: {
    opacity: 0.8,
  },
});
