import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';

type CampoProps = TextInputProps & {
  rotulo: string;
  // espaço abaixo do campo; o design usa valores diferentes por tela
  espaco?: number;
};

export function Campo({ rotulo, espaco = 14, style, ...props }: CampoProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={{ marginBottom: espaco }}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor="#94a3b8"
        {...props}
        onFocus={(e) => {
          setFocado(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, focado && styles.focado, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    ...Tipo.rotulo,
    color: Marca.texto,
    marginBottom: 6,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Marca.borda,
    borderRadius: 14,
    // sem lineHeight: em campos de texto ele corta o conteúdo no Android
    fontFamily: Fonte.regular,
    fontSize: 16,
    color: Marca.texto,
    backgroundColor: Marca.branco,
  },
  focado: {
    borderColor: Marca.laranjaEscuro,
  },
});
