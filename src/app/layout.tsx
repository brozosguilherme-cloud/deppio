import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Deppio",
    template: "%s · Deppio",
  },
  description:
    "Deppio — Gestão inteligente de estoque para pequenas e médias empresas. Controle produtos, vendas, faturamento e fornecedores em um só lugar.",
  keywords: ["gestão de estoque", "controle de estoque", "pdv", "erp", "pme"],
  authors: [{ name: "Deppio" }],
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
