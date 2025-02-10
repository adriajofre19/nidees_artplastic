import { Footer } from "@/components/footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/cart-context";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <main>

                <CartProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </CartProvider>
            </main>
        </div>
    );
}