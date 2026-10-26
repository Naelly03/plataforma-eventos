import { StyleSheet, View } from 'react-native';

type IconeOlhoProps = {
  // true = olho riscado (senha escondida); false = olho aberto (senha visível)
  riscado: boolean;
  color: string;
  size?: number;
};

// Olho desenhado com Views, para não depender de biblioteca de ícones
export function IconeOlho({ riscado, color, size = 24 }: IconeOlhoProps) {
  const largura = size * 0.92;
  const altura = size * 0.58;
  const pupila = size * 0.26;

  return (
    <View style={[styles.caixa, { width: size, height: size }]}>
      <View
        style={{
          width: largura,
          height: altura,
          borderRadius: '50%',
          borderWidth: 2,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: pupila,
            height: pupila,
            borderRadius: pupila / 2,
            backgroundColor: color,
          }}
        />
      </View>

      {riscado && (
        <View
          style={{
            position: 'absolute',
            width: size * 1.1,
            height: 2,
            borderRadius: 1,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
