import type { TextStyle } from 'react-native';

// No React Native cada peso do Figtree é uma família própria; não use
// fontWeight com estas fontes. Nomes vindos de @expo-google-fonts/figtree.
export const Fonte = {
  regular: 'Figtree_400Regular',
  media: 'Figtree_500Medium',
  negrito: 'Figtree_700Bold',
  extra: 'Figtree_800ExtraBold',
} as const;

// Escala da coluna "Mobile" do sistema tipográfico (Tipografia Agendou)
export const Tipo = {
  /** Splash e login. 32 / 1.15 · 800 · −1% */
  display: {
    fontFamily: Fonte.extra,
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -0.32,
  },
  /** Título de página. 28 / 1.15 · 800 · −1% */
  h1: {
    fontFamily: Fonte.extra,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.28,
  },
  /** Seção. 24 / 1.2 · 800 */
  h2: {
    fontFamily: Fonte.extra,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.12,
  },
  /** Nome do evento em card. 18 / 1.3 · 700 */
  h3: {
    fontFamily: Fonte.negrito,
    fontSize: 18,
    lineHeight: 23,
  },
  /** Descrições e texto corrido. 16 / 1.5 · 400 */
  corpo: {
    fontFamily: Fonte.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  /** Legendas e apoio. 14 / 1.4 · 400 */
  pequeno: {
    fontFamily: Fonte.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  /** Data, hora, local e contadores. 14 / 1.4 · 500 · números tabulares */
  rotulo: {
    fontFamily: Fonte.media,
    fontSize: 14,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  /** Botões, sem caixa alta. 16 · 700 */
  botao: {
    fontFamily: Fonte.negrito,
    fontSize: 16,
  },
} satisfies Record<string, TextStyle>;
