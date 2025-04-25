import Link from "next/link";
import Image from "next/image";
import DarkLightToggle from "../ui/Dark-light-toogle";
import { FaShoppingBag } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm flex items-center justify-center" style={{ backgroundColor: "#FF4700" }}>
            <Image 
              src="/images/logo_zaply.png" 
              alt="Logo Zaply" 
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            Bruno Caceres
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/products" 
            className="relative text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center gap-2"
          >
            <FaShoppingBag className="h-5 w-5" />
            <span>Produtos</span>
          </Link>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
          
          <DarkLightToggle />
        </nav>
      </div>
    </header>
  );
}