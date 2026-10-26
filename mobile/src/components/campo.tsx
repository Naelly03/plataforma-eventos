import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { IconeOlho } from '@/components/icone-olho';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';

type CampoProps = TextInputProps & {
  rotulo: string;
  // espaço abaixo do campo; o design usa valores diferentes por tela
  espaco?: number;
  // campo de senha: esconde o texto e mostra o olhinho para revelar
  senha?: boolean;
};

export function Campo({ rotulo, espaco = 14, senha = false, style, ...props }: CampoProps) {
  const [focado, setFocado] = useState(false);
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={{ marginBottom: espaco }}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View>
        <TextInput
          accessibilityLabel={rotulo}
          placeholderTextColor="#94a3b8"
          {...props}
          secureTextEntry={senha ? !visivel : props.secureTextEntry}
          autoCorrect={senha ? false : props.autoCorrect}
          autoCapitalize={senha ? 'none' : props.autoCapitalize}
          // com a senha à mostra, o Android não deve sugerir nem corrigir palavras
          keyboardType={
            senha && visivel && Platform.OS === 'android'
              ? 'visible-password'
              : props.keyboardType
          }
          onFocus={(e) => {
            setFocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            props.onBlur?.(e);
          }}
          style={[styles.input, senha && styles.comOlho, focado && styles.focado, style]}
        />

        {senha && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visivel ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityState={{ selected: visivel }}
            hitSlop={8}
            onPress={() => setVisivel((atual) => !atual)}
            style={styles.olho}>
            <IconeOlho riscado={!visivel} color={Marca.textoSuave} />
          </Pressable>
        )}
      </View>
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
  // espaço para o olhinho não ficar por cima do texto digitado
  comOlho: {
    paddingRight: 52,
  },
  focado: {
    borderColor: Marca.laranjaEscuro,
  },
  olho: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
