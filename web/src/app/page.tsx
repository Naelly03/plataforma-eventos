import { redirect } from "next/navigation";

// Sem landing page: quem não tem sessão é levado ao login pelo shell.
export default function HomePage() {
  redirect("/eventos");
}
