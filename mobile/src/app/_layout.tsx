// Cada peso vem do seu caminho: importar do pacote raiz embute todos os 14 arquivos
import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_700Bold } from '@expo-google-fonts/figtree/700Bold';
import { Figtree_800ExtraBold } from '@expo-google-fonts/figtree/800ExtraBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Marca } from '@/constants/marca';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { InscricoesProvider } from '@/context/inscricoes-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navegacao />
    </AuthProvider>
  );
}

function Navegacao() {
  const { token, usuario, carregando } = useAuth();
  const [fontesProntas, erroNasFontes] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });

  // Se as fontes falharem, o app segue com a fonte do sistema
  const pronto = !carregando && (fontesProntas || Boolean(erroNasFontes));

  // A splash nativa fica na tela até a sessão e as fontes estarem prontas
  useEffect(() => {
    if (pronto) void SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  const logado = Boolean(token);

  return (
    // `key` zera as inscrições ao trocar de usuário
    <InscricoesProvider key={usuario?.id ?? 'anonimo'}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Marca.fundo },
        }}>
        <Stack.Protected guard={!logado}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="cadastro" />
        </Stack.Protected>

        <Stack.Protected guard={logado}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="evento/[id]" />
        </Stack.Protected>
      </Stack>
    </InscricoesProvider>
  );
}
