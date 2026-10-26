import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { Campo } from '@/components/campo';
import { Aviso } from '@/components/feedback';
import { LogoIcon } from '@/components/logo';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { useAuth } from '@/context/auth-context';
import { mensagemDoErro } from '@/lib/api';

export default function LoginScreen() {
  const router = useRouter();
  const { entrar } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar() {
    if (!email.trim() || !senha) {
      setErro('Informe seu e-mail e sua senha.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      // com a sessão iniciada, a rota protegida leva para a lista de eventos
      await entrar(email.trim(), senha);
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível entrar. Tente novamente.'));
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView
        style={styles.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled">
          <LogoIcon size={56} />
          <Text style={styles.titulo}>Bem-vindo{'\n'}de volta</Text>
          <Text style={styles.subtitulo}>
            Entre para ver e se inscrever em eventos.
          </Text>

          <Campo
            rotulo="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />
          <Campo
            rotulo="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            espaco={22}
            onSubmitEditing={enviar}
          />

          {erro ? <Aviso texto={erro} /> : null}

          <Botao titulo="Entrar" onPress={enviar} carregando={carregando} />

          <View style={styles.espaco} />
          <Text style={styles.rodape}>
            Não tem conta?{' '}
            <Text style={styles.link} onPress={() => router.replace('/cadastro')}>
              Cadastre-se
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Marca.fundo,
  },
  conteudo: {
    flexGrow: 1,
    paddingTop: 36,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  titulo: {
    ...Tipo.display,
    marginTop: 18,
    marginBottom: 6,
    color: Marca.texto,
  },
  subtitulo: {
    ...Tipo.corpo,
    marginBottom: 24,
    color: Marca.textoSuave,
  },
  espaco: {
    flex: 1,
    minHeight: 20,
  },
  rodape: {
    ...Tipo.corpo,
    textAlign: 'center',
    color: Marca.textoMedio,
  },
  link: {
    fontFamily: Fonte.negrito,
    color: Marca.azul,
  },
});
