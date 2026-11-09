import type { TextStyle } from 'react-native';

export const Fonte = {
  regular: 'Geist_400Regular',
  media: 'Geist_500Medium',
  negrito: 'Geist_700Bold',
  extra: 'Geist_800ExtraBold',
} as const;

export const Tipo = {
  display: {
    fontFamily: Fonte.extra,
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -0.32,
  },
  h1: {
    fontFamily: Fonte.extra,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.28,
  },
  h2: {
    fontFamily: Fonte.extra,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.12,
  },
  h3: {
    fontFamily: Fonte.negrito,
    fontSize: 18,
    lineHeight: 23,
  },
  corpo: {
    fontFamily: Fonte.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  pequeno: {
    fontFamily: Fonte.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  rotulo: {
    fontFamily: Fonte.media,
    fontSize: 14,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  botao: {
    fontFamily: Fonte.negrito,
    fontSize: 16,
  },
} satisfies Record<string, TextStyle>;
