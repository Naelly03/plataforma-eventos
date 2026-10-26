import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { LogoIcon } from '@/components/logo';
import { Marca } from '@/constants/marca';
import { Tipo } from '@/constants/tipografia';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.brilho} />

      <View style={styles.centro}>
        <LogoIcon size={104} />
        <View style={styles.textos}>
          <Text style={styles.titulo}>Agendou</Text>
          <Text style={styles.subtitulo}>
            Eventos organizados, presença confirmada
          </Text>
        </View>
      </View>

      <View style={styles.acoes}>
        <Botao titulo="Criar conta" onPress={() => router.push('/cadastro')} />
        <Botao
          titulo="Já tenho conta"
          variante="claro"
          onPress={() => router.push('/login')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Marca.noite,
    paddingHorizontal: 28,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  // brilho laranja suave atrás do logo, como no design
  brilho: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(234, 88, 12, 0.14)',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  textos: {
    alignItems: 'center',
  },
  titulo: {
    ...Tipo.display,
    color: Marca.branco,
  },
  subtitulo: {
    ...Tipo.corpo,
    marginTop: 6,
    textAlign: 'center',
    color: '#cbd5e1',
  },
  acoes: {
    gap: 12,
  },
});
