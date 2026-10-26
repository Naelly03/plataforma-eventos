export type Usuario = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type RespostaDeAuth = {
  token: string;
  user: Usuario;
};
