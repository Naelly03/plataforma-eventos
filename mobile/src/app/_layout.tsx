import { Geist_400Regular } from '@expo-google-fonts/geist/400Regular';
import { Geist_500Medium } from '@expo-google-fonts/geist/500Medium';
import { Geist_700Bold } from '@expo-google-fonts/geist/700Bold';
import { Geist_800ExtraBold } from '@expo-google-fonts/geist/800ExtraBold';
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
    Geist_400Regular,
    Geist_500Medium,
    Geist_700Bold,
    Geist_800ExtraBold,
  });

  const pronto = !carregando && (fontesProntas || Boolean(erroNasFontes));

  useEffect(() => {
    if (pronto) void SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  const logado = Boolean(token);

  return (
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
