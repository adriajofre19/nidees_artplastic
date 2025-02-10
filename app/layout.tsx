
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Comfortaa } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { Footer } from '@/components/footer';


const inter = Inter({ subsets: ['latin'] });
const comfortaa = Comfortaa({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NiDEES - Artesanía Sostenible',
  description: 'Artesanía creada con bolsas de plástico recicladas. Reutilizamos artesanalmente las bolsas de plástico para convertirlas en diseños únicos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className={comfortaa.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
