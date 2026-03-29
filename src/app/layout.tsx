import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Deppio — Gestão inteligente de estoque",
    template: "%s · Deppio",
  },
  description:
    "Gestão inteligente de estoque para pequenas e médias empresas. Controle produtos, vendas, faturamento e fornecedores em um só lugar.",
  keywords: ["gestão de estoque", "controle de estoque", "pdv", "erp", "pme", "inventário", "sistema de estoque"],
  authors: [{ name: "Deppio" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Deppio",
    title: "Deppio — Gestão inteligente de estoque",
    description: "Controle produtos, vendas, PDV, matérias-primas e muito mais. Plataforma completa para pequenas e médias empresas brasileiras.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deppio — Gestão inteligente de estoque",
    description: "Controle produtos, vendas, PDV e muito mais. Plataforma completa para PMEs brasileiras.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://inventory-saas-beta.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        {/* Toast de feedback global */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
