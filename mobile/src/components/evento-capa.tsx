import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

import { Marca } from '@/constants/marca';

type EventoCapaProps = {
  imageUrl?: string;
  altura: number;
  style?: StyleProp<ImageStyle>;
};

// Imagem do evento; se não carregar, fica o fundo cinza.
export function EventoCapa({ imageUrl, altura, style }: EventoCapaProps) {
  return (
    <Image
      source={imageUrl ? { uri: imageUrl } : undefined}
      contentFit="cover"
      style={[{ height: altura, backgroundColor: Marca.bordaClara }, style]}
      accessibilityIgnoresInvertColors
    />
  );
}
