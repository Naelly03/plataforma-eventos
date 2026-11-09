import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const nativo = Platform.OS !== 'web';

export const storage = {
  async ler(chave: string) {
    try {
      return nativo
        ? await SecureStore.getItemAsync(chave)
        : localStorage.getItem(chave);
    } catch {
      return null;
    }
  },

  async salvar(chave: string, valor: string) {
    try {
      if (nativo) await SecureStore.setItemAsync(chave, valor);
      else localStorage.setItem(chave, valor);
    } catch {
    }
  },

  async remover(chave: string) {
    try {
      if (nativo) await SecureStore.deleteItemAsync(chave);
      else localStorage.removeItem(chave);
    } catch {
    }
  },
};
