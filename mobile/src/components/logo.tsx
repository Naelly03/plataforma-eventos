import { View } from 'react-native';

type LogoIconProps = {
  size?: number;
};

// Calendário com check do Agendou, desenhado com Views na mesma grade 120x120
// do logo do design (assim não precisa de react-native-svg).
export function LogoIcon({ size = 56 }: LogoIconProps) {
  const k = size / 120;
  const traco = 8 * k;
  const branco = '#ffffff';

  // traço com pontas arredondadas entre dois pontos da grade 120x120
  function segmento(x1: number, y1: number, x2: number, y2: number) {
    const comprimento = Math.hypot(x2 - x1, y2 - y1) * k + traco;
    const angulo = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const centroX = ((x1 + x2) / 2) * k;
    const centroY = ((y1 + y2) / 2) * k;

    return {
      position: 'absolute' as const,
      left: centroX - comprimento / 2,
      top: centroY - traco / 2,
      width: comprimento,
      height: traco,
      borderRadius: traco / 2,
      backgroundColor: branco,
      transform: [{ rotate: `${angulo}deg` }],
    };
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Agendou"
      style={{
        width: size,
        height: size,
        borderRadius: 34 * k,
        overflow: 'hidden',
        experimental_backgroundImage:
          'linear-gradient(135deg, #c2410c, #ea580c)',
      }}>
      <View
        style={{
          position: 'absolute',
          left: 30 * k,
          top: 38 * k,
          width: 60 * k,
          height: 54 * k,
          borderRadius: 12 * k,
          borderWidth: traco,
          borderColor: branco,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 30 * k,
          top: 54 * k,
          width: 60 * k,
          height: traco,
          backgroundColor: branco,
        }}
      />
      <View style={segmento(48, 28, 48, 44)} />
      <View style={segmento(72, 28, 72, 44)} />
      <View style={segmento(47, 76, 56, 85)} />
      <View style={segmento(56, 85, 73, 68)} />
    </View>
  );
}
