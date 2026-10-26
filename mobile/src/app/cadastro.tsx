import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { Campo } from '@/components/campo';
import { Aviso } from '@/components/feedback';
import { Marca } from '@/constants/marca';
import { Fonte, Tipo } from '@/constants/tipografia';
import { useAuth } from '@/context/auth-context';
import { mensagemDoErro } from '@/lib/api';

export default function CadastroScreen() {
  const router = useRouter();
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar() {
    if (nome.trim().length < 2) {
      setErro('Informe seu nome.');
      return;
    }
    if (!email.trim()) {
      setErro('Informe seu e-mail.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      // cria a conta e já entra; a rota protegida leva para a lista de eventos
      await cadastrar(nome.trim(), email.trim(), senha);
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível criar a conta. Tente novamente.'));
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
          <Text
            accessibilityRole="link"
            style={styles.voltar}
            onPress={() => router.replace('/login')}>
            ← Voltar
          </Text>
          <Text style={styles.titulo}>Crie sua conta</Text>
          <Text style={styles.subtitulo}>Leva menos de um minuto.</Text>

          <Campo
            rotulo="Nome"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoComplete="name"
            espaco={12}
          />
          <Campo
            rotulo="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            espaco={12}
          />
          <Campo
            rotulo="Senha"
            value={senha}
            onChangeText={setSenha}
            senha
            autoCapitalize="none"
            autoComplete="new-password"
            espaco={12}
          />
          <Campo
            rotulo="Confirme sua senha"
            value={confirmacao}
            onChangeText={setConfirmacao}
            senha
            autoCapitalize="none"
            autoComplete="new-password"
            espaco={20}
            onSubmitEditing={enviar}
          />

          {erro ? <Aviso texto={erro} /> : null}

          <Botao titulo="Criar conta" onPress={enviar} carregando={carregando} />
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
    padding: 24,
  },
  voltar: {
    ...Tipo.corpo,
    fontFamily: Fonte.media,
    alignSelf: 'flex-start',
    marginBottom: 18,
    color: Marca.textoSuave,
  },
  titulo: {
    ...Tipo.display,
    marginBottom: 6,
    color: Marca.texto,
  },
  subtitulo: {
    ...Tipo.corpo,
    marginBottom: 20,
    color: Marca.textoSuave,
  },
});
