import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">NiDEES</h3>
            <p className="text-sm text-gray-600">
              Transformando residuos plásticos en arte sostenible.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-sm text-gray-600 hover:text-emerald-600">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/nosaltres" className="text-sm text-gray-600 hover:text-emerald-600">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-gray-600 hover:text-emerald-600">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/nidees_artplastic/" className="text-gray-600 hover:text-emerald-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} NiDEES. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}