import { Product } from "@/types/product";
import Image from "next/image";
import { memo } from 'react';
import { FaTag } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  imageStatus: 'loading' | 'error' | 'loaded';
  onEdit: (product: Product) => void;
  onImageError: () => void;
  onImageLoad: () => void;
}

const ProductCard = ({
  product,
  viewMode,
  imageStatus,
  onEdit,
  onImageError,
  onImageLoad,
}: ProductCardProps) => {

  const shouldUseEagerLoading = product.id < 4;

  const containerClasses = `bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 
    dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300 
    ${viewMode === 'list' ? 'flex flex-col sm:flex-row md:h-48' : 'flex flex-col h-full'}`;

  const imageContainerClasses = viewMode === 'list'
    ? 'w-full sm:w-48 md:w-52 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700'
    : 'h-48 sm:h-56 w-full border-b border-gray-100 dark:border-gray-700';

  const contentClasses = viewMode === 'list'
    ? 'flex-grow p-4 sm:p-5'
    : 'p-3 sm:p-4';

  const titleClasses = viewMode === 'list'
    ? 'text-lg sm:text-xl line-clamp-1'
    : 'text-md sm:text-lg line-clamp-2';

  const priceContainerClasses = viewMode === 'list'
    ? 'mt-1 sm:mt-2'
    : 'mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700';

  return (
    <div className={containerClasses}>
      <div className={`${imageContainerClasses} relative bg-white flex items-center justify-center overflow-hidden`}>
        {product.image && imageStatus !== 'error' ? (
          <div className="relative h-full w-full bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-4 transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                }`}
              onError={onImageError}
              onLoad={onImageLoad}
              loading={shouldUseEagerLoading ? "eager" : "lazy"}
              priority={shouldUseEagerLoading}
              quality={80}
            />
            {imageStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-white/90 backdrop-blur-sm">
                <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
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

        {product.categories && (
          <div className="absolute top-2 right-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-500 text-orange-700 dark:text-white border border-orange-100 dark:border-orange-600 shadow-sm">
              {product.categories}
            </span>
          </div>
        )}
      </div>

      <div className={`flex flex-col ${contentClasses}`}>
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-medium text-gray-900 dark:text-white ${titleClasses}`}>
              {product.name}
            </h3>
          </div>

          <div className="flex items-center mt-1 mb-1">
            <span className="inline-flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <FaTag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-gray-400" />
              {product.brand}
            </span>
          </div>

          {viewMode === 'list' && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 mb-2 sm:mb-3 line-clamp-2">
              {`Produto da categoria ${product.categories || 'não especificada'} da marca ${product.brand}.`}
            </p>
          )}
        </div>

        <div className={`flex justify-between items-center ${priceContainerClasses}`}>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Preço</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => onEdit(product)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center space-x-1"
            aria-label="Editar produto"
          >
            <TbEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.imageStatus === nextProps.imageStatus
  );
});