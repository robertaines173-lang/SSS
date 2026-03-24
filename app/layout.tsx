import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sushi Delivery - Culinaria Japonesa - Faca seu pedido!",
  description: "PROMOCAO INAUGURACAO - Delivery Culinaria Japonesa. Acesse e peca agora pelo delivery food!",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
