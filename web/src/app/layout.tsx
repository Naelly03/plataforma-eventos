
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import DashboardShell from "@/components/dashboard-shell";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Agendou | Gestão de Eventos",
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
        {/* usePathname() do shell depende da rota; em rotas dinâmicas precisa de Suspense */}
        <Suspense fallback={null}>
          <DashboardShell>{children}</DashboardShell>
        </Suspense>
      </body>
    </html>
  );
}
