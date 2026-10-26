import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/botao';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';

// Mensagem de erro curta, usada dentro de formulários e telas
export function Aviso({ texto }: { texto: string }) {
  return (
    <View accessibilityRole="alert" style={styles.aviso}>
      <Text style={styles.avisoTexto}>{texto}</Text>
    </View>
  );
}

// Estado de erro da lista, com "Tentar novamente" (como no design)
export function ErroDeCarregamento({
  mensagem,
  onTentarNovamente,
}: {
  mensagem: string;
  onTentarNovamente: () => void;
}) {
  return (
    <View accessibilityRole="alert" style={styles.erro}>
      <View style={styles.erroIcone}>
        <Text style={styles.erroIconeTexto}>!</Text>
      </View>
      <Text style={styles.erroTitulo}>Não foi possível carregar</Text>
      <Text style={styles.erroMensagem}>{mensagem}</Text>
      <Botao titulo="Tentar novamente" onPress={onTentarNovamente} altura={46} />
    </View>
  );
}

// Cartões cinza enquanto a lista carrega (como no design)
export function EsqueletoDeCards({ quantidade = 3 }: { quantidade?: number }) {
  return (
    <View accessibilityLabel="Carregando" style={styles.esqueletos}>
      {Array.from({ length: quantidade }, (_, i) => (
        <View key={i} style={styles.esqueletoCard}>
          <View style={styles.esqueletoCapa} />
          <View style={styles.esqueletoCorpo}>
            <View style={[styles.esqueletoLinha, { width: '70%', height: 16 }]} />
            <View style={[styles.esqueletoLinha, { width: '45%', height: 12, backgroundColor: '#f1f5f9' }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function EstadoVazio({ texto }: { texto: string }) {
  return (
    <View style={styles.vazio}>
      <Text style={styles.vazioTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Marca.perigoFundo,
    marginBottom: 14,
  },
  avisoTexto: {
    ...Tipo.pequeno,
    color: '#b91c1c',
  },
  erro: {
    marginTop: 40,
    padding: 28,
    alignItems: 'center',
    backgroundColor: Marca.branco,
    borderWidth: 1,
    borderColor: Marca.perigoBorda,
    borderRadius: 20,
  },
  erroIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Marca.perigoFundo,
    marginBottom: 14,
  },
  erroIconeTexto: {
    color: Marca.perigo,
    fontFamily: Fonte.extra,
    fontSize: 24,
  },
  erroTitulo: {
    ...Tipo.h3,
    color: Marca.texto,
  },
  erroMensagem: {
    ...Tipo.corpo,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
    color: Marca.textoSuave,
  },
  esqueletos: {
    gap: 16,
  },
  esqueletoCard: {
    backgroundColor: Marca.branco,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Marca.bordaClara,
  },
  esqueletoCapa: {
    height: 120,
    backgroundColor: Marca.bordaClara,
  },
  esqueletoCorpo: {
    padding: 14,
    gap: 8,
  },
  esqueletoLinha: {
    borderRadius: 8,
    backgroundColor: Marca.bordaClara,
  },
  vazio: {
    marginTop: 20,
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Marca.borda,
    borderRadius: 18,
  },
  vazioTexto: {
    ...Tipo.pequeno,
    textAlign: 'center',
    color: Marca.textoSuave,
  },
});
