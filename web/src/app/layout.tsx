
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import DashboardApp from "@/components/dashboard-app";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <DashboardApp>{children}</DashboardApp>
        </Suspense>
      </body>
    </html>
  );
}
