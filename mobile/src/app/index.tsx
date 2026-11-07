import { Redirect } from 'expo-router';

// Sem tela de boas-vindas: quem não tem sessão começa no login.
export default function Index() {
  return <Redirect href="/login" />;
}
