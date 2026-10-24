"use client";

import { useMemo, useSyncExternalStore } from "react";

const TOKEN_KEY = "eventum_token";
const USER_KEY = "eventum_user";

export type Usuario = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const ouvintes = new Set<() => void>();

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function assinar(callback: () => void) {
  ouvintes.add(callback);
  window.addEventListener("storage", callback);

  return () => {
    ouvintes.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function lerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function iniciarSessao(token: string, user?: Usuario) {
  localStorage.setItem(TOKEN_KEY, token);

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  notificar();
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notificar();
}

function lerUsuarioBruto() {
  return localStorage.getItem(USER_KEY);
}

function semDados() {
  return null;
}

function semAssinatura() {
  return () => {};
}

// `pronto` só é true no cliente, depois da hidratação. Antes disso o token
// ainda não pôde ser lido, então "sem token" não significa "sem sessão".
export function useSessao() {
  const token = useSyncExternalStore(assinar, lerToken, semDados);
  const usuarioBruto = useSyncExternalStore(assinar, lerUsuarioBruto, semDados);
  const pronto = useSyncExternalStore(
    semAssinatura,
    () => true,
    () => false,
  );

  const user = useMemo(() => {
    if (!usuarioBruto) return null;

    try {
      return JSON.parse(usuarioBruto) as Usuario;
    } catch {
      return null;
    }
  }, [usuarioBruto]);

  return { pronto, token, user };
}
