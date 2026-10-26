import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';

import { gradienteDoEvento } from '@/constants/marca';

type EventoCapaProps = PropsWithChildren<{
  id: string;
  imageUrl?: string;
  altura: number;
  style?: StyleProp<ViewStyle>;
}>;

// Capa do evento: a imagem da API sobre o gradiente do design. Se a imagem
// não carregar, o gradiente continua aparecendo.
export function EventoCapa({ id, imageUrl, altura, style, children }: EventoCapaProps) {
  return (
    <View
      style={[
        { height: altura, experimental_backgroundImage: gradienteDoEvento(id) },
        style,
      ]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          contentFit="cover"
          transition={150}
          style={StyleSheet.absoluteFill}
          accessibilityIgnoresInvertColors
        />
      ) : null}
      {children}
    </View>
  );
}
