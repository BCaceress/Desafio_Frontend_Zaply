import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';
import { FaCheck, FaLayerGroup, FaRedo, FaSort, FaSortAmountDown, FaSortAmountUp, FaTag } from 'react-icons/fa';
import { TbCash } from 'react-icons/tb';

interface ProductFiltersProps {
  showFilters: boolean;
  availableBrands: string[];
  availableCategories: string[];
  selectedBrands: string[];
  selectedCategories: string[];
  priceRange: [number, number];
  maxPrice: number;
  sortBy: 'name' | 'price' | 'brand' | 'none';
  sortDirection: 'asc' | 'desc';
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => void;
  onSortByChange: (value: 'name' | 'price' | 'brand' | 'none') => void;
  onSortDirectionToggle: () => void;
  resetFilters: () => void;
}

const ProductFilters = ({
  showFilters,
  availableBrands,
  availableCategories,
  selectedBrands,
  selectedCategories,
  priceRange,
  maxPrice,
  sortBy,
  sortDirection,
  onBrandToggle,
  onCategoryToggle,
  onPriceChange,
  onSortByChange,
  onSortDirectionToggle,
  resetFilters
}: ProductFiltersProps) => {
  const clearSelected = useCallback((items: string[], toggleFn: (item: string) => void) => {
    items.forEach(item => toggleFn(item));
  }, []);

  const hasActiveFilters = selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    sortBy !== 'none';

  const renderCheckboxList = (
    items: string[],
    selectedItems: string[],
    toggleFn: (item: string) => void,
    emptyMessage: string
  ) => (
    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-4 custom-scrollbar rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      {items.length > 0 ? (
        items.map(item => (
          <div key={item} className="flex items-center group">
            <label className="flex items-center space-x-2 cursor-pointer w-full py-1.5 px-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => toggleFn(item)}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 border rounded-md transition-colors duration-200 flex items-center justify-center
                  ${selectedItems.includes(item)
                    ? 'bg-orange-600 border-orange-600 dark:bg-orange-500 dark:border-orange-500'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'}
                  peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-1`}
                >
                  {selectedItems.includes(item) && (
                    <FaCheck className="h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 flex-grow">{item}</span>
            </label>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-2 text-center">{emptyMessage}</p>
      )}
    </div>
  );

  const filterContainerAnimation = {
    initial: false,
    animate: showFilters ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <motion.div
      {...filterContainerAnimation}
      className={`overflow-hidden ${showFilters ? 'mt-6 pt-6 border-t border-gray-200 dark:border-gray-700' : ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaTag className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
              Marcas
            </h3>
            {selectedBrands.length > 0 && (
              <button
                onClick={() => clearSelected(selectedBrands, onBrandToggle)}
                className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Limpar
              </button>
            )}
          </div>
          {renderCheckboxList(
            availableBrands,
            selectedBrands,
            onBrandToggle,
            "Nenhuma marca disponível"
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
              <FaLayerGroup className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
              Categorias
            </h3>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => clearSelected(selectedCategories, onCategoryToggle)}
                className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Limpar
              </button>
            )}
          </div>
          {renderCheckboxList(
            availableCategories,
            selectedCategories,
            onCategoryToggle,
            "Nenhuma categoria disponível"
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                <TbCash className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                Faixa de Preço
              </h3>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                R$ {priceRange[0].toFixed(2)} - R$ {priceRange[1].toFixed(2)}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">R$ 0</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">R$ {maxPrice}</span>
              </div>
              <div className="relative mb-5 h-2">
                <div className="absolute h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                <div
                  className="absolute h-2 bg-orange-500 dark:bg-orange-600 rounded-full"
                  style={{
                    left: `${(priceRange[0] / maxPrice) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mínimo</label>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange(e, 0)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-gray-800 [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Máximo</label>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange(e, 1)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-gray-800 [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                <FaSort className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                Ordenar por
              </h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value as 'name' | 'price' | 'brand' | 'none')}
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2.5"
                >
                  <option value="none">Sem ordenação</option>
                  <option value="name">Nome</option>
                  <option value="price">Preço</option>
                  <option value="brand">Marca</option>
                </select>
                <button
                  onClick={onSortDirectionToggle}
                  className={`px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${sortBy === 'none' ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-300 dark:hover:border-orange-700'}`}
                  disabled={sortBy === 'none'}
                  aria-label={sortDirection === 'asc' ? 'Ordenar crescente' : 'Ordenar decrescente'}
                >
                  {sortDirection === 'asc' ? (
                    <FaSortAmountUp className="h-5 w-5" />
                  ) : (
                    <FaSortAmountDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>


          <button
            onClick={resetFilters}
            className={`w-full py-3 text-sm font-medium flex items-center justify-center rounded-lg text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition-colors duration-200 shadow-sm hover:shadow ${!hasActiveFilters ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasActiveFilters}
          >
            <FaRedo className="h-4 w-4 mr-1.5" />
            Limpar todos os filtros
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductFilters);