
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import DashboardShell from "@/components/dashboard-shell";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Agendei | Gestão de Eventos",
  description: "Plataforma de gerenciamento e participação em eventos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${figtree.variable} font-sans antialiased`}>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
