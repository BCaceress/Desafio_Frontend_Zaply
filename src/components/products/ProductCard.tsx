import { memo } from 'react';
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MdImage } from "react-icons/md";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  imageStatus: 'loading' | 'error' | 'loaded';
  onEdit: (product: Product) => void;
  onImageError: (productId: number) => void;
  onImageLoad: (productId: number) => void;
  itemVariants: Variants;
}

const ProductCard = ({
  product,
  viewMode,
  imageStatus,
  onEdit,
  onImageError,
  onImageLoad,
  itemVariants
}: ProductCardProps) => {
  // Prevent unnecessary image processing when not visible
  const shouldUseEagerLoading = product.id < 4; // Only the first few products use eager loading

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300 ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row md:h-48' : 'flex flex-col h-full'
      }`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.01, // Reduzido de 1.02 para uma escala menor no hover
        transition: { duration: 0.15 } // Mais rápido
      }}
      layout="position"
      transition={{
        layout: { duration: 0.2, type: "tween" }, // Usando tween em vez de spring para transição mais suave
        opacity: { duration: 0.15 } // Transição de opacidade mais rápida
      }}
    >
      <motion.div 
        layout="position"
        className={`${
          viewMode === 'list' 
            ? 'w-full sm:w-48 md:w-52 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700' 
            : 'h-48 sm:h-56 w-full border-b border-gray-100 dark:border-gray-700'
        } relative bg-white flex items-center justify-center overflow-hidden`}
        transition={{ duration: 0.2 }} // Transição simplificada
      >
        {product.image && imageStatus !== 'error' ? (
          <div className="relative h-full w-full bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-4 transition-opacity duration-300 ${
                imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
              onError={() => onImageError(product.id)}
              onLoad={() => onImageLoad(product.id)}
              loading={shouldUseEagerLoading ? "eager" : "lazy"}
              priority={shouldUseEagerLoading}
              quality={80}
              unoptimized={false}
            />
            {imageStatus === 'loading' && (
              <motion.div 
                initial={{ opacity: 0.8 }} // Menos contraste no carregador
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-white/90 backdrop-blur-sm"
              >
                <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full p-4 sm:p-6 text-gray-400 bg-white">
            <div className="flex items-center justify-center h-16 sm:h-20 w-16 sm:w-20 bg-gray-100 dark:bg-gray-200 rounded-full mb-3">
              <MdImage size={32} className="sm:text-4xl" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-center">Produto sem imagem disponível</p>
          </div>
        )}
        
        {/* Badge para categoria - animações mais sutis */}
        {product.categories && (
          <motion.div 
            className="absolute top-2 right-1"
            initial={{ opacity: 0.8, y: -5 }} // Menos movimento e mais opacidade inicial
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }} // Mais rápido
          >
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-500 text-orange-700 dark:text-white border border-orange-100 dark:border-orange-600 shadow-sm">
              {product.categories}
            </span>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        layout="position"
        className={`flex flex-col ${viewMode === 'list' ? 'flex-grow p-4 sm:p-5' : 'p-3 sm:p-4'}`}
        transition={{ duration: 0.2 }} // Transição simplificada
      >
        <motion.div layout="position" className="flex-grow">
          <motion.div layout="position" className="flex items-start justify-between mb-2">
            <h3 className={`font-medium text-gray-900 dark:text-white ${viewMode === 'list' ? 'text-lg sm:text-xl line-clamp-1' : 'text-md sm:text-lg line-clamp-2'}`}>
              {product.name}
            </h3>
          </motion.div>
          
          <motion.div layout="position" className="flex items-center mt-1 mb-1">
            <span className="inline-flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
              </svg>
              {product.brand}
            </span>
          </motion.div>
          
          <AnimatePresence>
            {viewMode === 'list' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }} // Transição mais rápida
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 mb-2 sm:mb-3 line-clamp-2"
              >
                {"Produto da categoria " + product.categories + " da marca " + product.brand + "."}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          layout="position"
          className={`flex justify-between items-center ${viewMode === 'list' ? 'mt-1 sm:mt-2' : 'mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700'}`}
        >
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0.9 }} // Mais opacidade inicial
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }} // Mais rápido
          >
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Preço</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              R$ {product.price.toFixed(2)}
            </span>
          </motion.div>
          <motion.button
            onClick={() => onEdit(product)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center space-x-1"
            aria-label="Editar produto"
            initial={{ opacity: 0.9, scale: 0.95 }} // Mais opacidade inicial e menos escala
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }} // Mais rápido
            whileHover={{ 
              scale: 1.03, // Escala menor no hover
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export default memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these specific props changed
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.imageStatus === nextProps.imageStatus
  );
});