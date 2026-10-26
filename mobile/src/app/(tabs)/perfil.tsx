import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { useAuth } from '@/context/auth-context';

export default function PerfilScreen() {
  const { usuario, sair } = useAuth();

  return (
    <SafeAreaView edges={['top']} style={styles.tela}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Perfil</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>
              {usuario?.name.trim()[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={styles.dados}>
            <Text style={styles.nome} numberOfLines={1}>
              {usuario?.name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {usuario?.email}
            </Text>
          </View>
        </View>

        <Botao titulo="Sair da conta" variante="perigo" onPress={() => void sair()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Marca.fundo,
  },
  conteudo: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  titulo: {
    ...Tipo.h1,
    marginTop: 8,
    marginBottom: 22,
    color: Marca.texto,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    marginBottom: 18,
    backgroundColor: Marca.branco,
    borderWidth: 1,
    borderColor: Marca.bordaClara,
    borderRadius: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    experimental_backgroundImage: 'linear-gradient(160deg, #c2410c, #ea580c)',
  },
  avatarLetra: {
    fontFamily: Fonte.extra,
    fontSize: 24,
    color: Marca.branco,
  },
  dados: {
    flex: 1,
  },
  nome: {
    ...Tipo.h3,
    color: Marca.texto,
  },
  email: {
    ...Tipo.corpo,
    color: Marca.textoSuave,
  },
});
