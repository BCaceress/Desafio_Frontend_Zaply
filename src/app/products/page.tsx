"use client";

import ProductFilters from "@/components/products/ProductFilters";
import Loading from "@/components/ui/Loading";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiSad } from "react-icons/bi";
import { FaCheck, FaFilter, FaListUl, FaSearch, FaThLarge } from "react-icons/fa";
import { TbAlertCircle, TbPlus } from "react-icons/tb";

const ProductCard = dynamic(() => import('@/components/products/ProductCard'), {
  loading: () => <div className="h-72 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />,
  ssr: false
});

const ProductEditor = dynamic(() => import('@/components/products/ProductModal'), {
  ssr: false
});

export default function Products() {
  // Produtos 
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Modal 
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //Imagem
  const [imageStatuses, setImageStatuses] = useState<Record<number, 'loading' | 'error' | 'loaded'>>({});

  // Filtros
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'brand' | 'none'>('none');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Chamada da API
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await fetch("https://7daf496f49c24182af48ee21542cd665.api.mockbin.io/");

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        const validProducts = data.filter((p: Product) =>
          p.id && p.name && p.brand && (typeof p.price === 'number')
        );

        const brandsSet = new Set<string>();
        const categoriesSet = new Set<string>();
        let highestPrice = 0;

        validProducts.forEach((product: Product) => {
          brandsSet.add(product.brand);
          if (product.categories) categoriesSet.add(product.categories);
          if (product.price > highestPrice) highestPrice = product.price;
        });

        setProducts(validProducts);
        setFilteredProducts(validProducts);
        setAvailableBrands([...brandsSet].sort());
        setAvailableCategories([...categoriesSet].sort());

        const ceiling = Math.ceil(highestPrice);
        setMaxPrice(ceiling);
        setPriceRange([0, ceiling]);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(`Falha ao carregar produtos: ${errorMessage}`);
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Lógica dos filtros e ordenação
  useEffect(() => {
    if (!products.length) return;

    let result = [...products];

    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        (product.categories && product.categories.toLowerCase().includes(searchLower))
      );
    }

    if (selectedBrands.length) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }

    if (selectedCategories.length) {
      result = result.filter(product => selectedCategories.includes(product.categories));
    }

    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (sortBy !== 'none') {
      result.sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
        else if (sortBy === 'price') comparison = a.price - b.price;
        else if (sortBy === 'brand') comparison = a.brand.localeCompare(b.brand);

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredProducts(result);
  }, [debouncedSearchTerm, products, selectedBrands, selectedCategories, priceRange, sortBy, sortDirection]);

  const handleImageStatus = useCallback((productId: number, status: 'loading' | 'error' | 'loaded') => {
    setImageStatuses(prev => ({ ...prev, [productId]: status }));
  }, []);


  const handleEdit = useCallback((product: Product) => {
    setEditingProduct({ ...product });
    setNewProduct(false);
    setIsModalOpen(true);
  }, []);

  const handleAddProduct = useCallback(() => {
    setEditingProduct({
      id: -Date.now(),
      name: '',
      brand: '',
      categories: '',
      price: 0,
      image: ''
    });
    setNewProduct(true);
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!editingProduct) return;

    setSuccessMessage(newProduct ? "Produto adicionado com sucesso!" : "Produto atualizado com sucesso!");
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);

    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct(false);
  }, [editingProduct, newProduct]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Product) => {
    if (!editingProduct) return;

    setEditingProduct(prev => ({
      ...prev!,
      [field]: field === 'price' ? parseFloat(e.target.value) : e.target.value
    }));
  }, [editingProduct]);

  const handleImageChange = useCallback((imageUrl: string) => {
    if (!editingProduct) return;

    setEditingProduct(prev => ({ ...prev!, image: imageUrl }));
  }, [editingProduct]);

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands(prev => prev.includes(brand)
      ? prev.filter(b => b !== brand)
      : [...prev, brand]
    );
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories(prev => prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category]
    );
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newValue = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = newValue;
      return newRange;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortBy('none');
    setSortDirection('asc');
  }, [maxPrice]);

  const activeFiltersCount = useMemo(() =>
    selectedBrands.length +
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)
    , [selectedBrands.length, selectedCategories.length, priceRange, maxPrice]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Produtos</h1>
            <button
              onClick={handleAddProduct}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <TbPlus className="h-5 w-5" />
              <span>Adicionar Produto</span>
            </button>
          </div>

          {/* Alerta (Toast) */}
          <AnimatePresence>
            {showSuccessAlert && (
              <motion.div
                className="fixed top-5 right-5 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <FaCheck className="mr-2" />
                <span className="font-medium">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 mx-4 sm:mx-6 lg:mx-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-3/4 lg:w-2/3">
                <input
                  type="text"
                  placeholder="Buscar produtos por nome, marca ou categoria..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition duration-200 flex items-center ${viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    aria-label="Ver em grade"
                  >
                    <FaThLarge className="h-5 w-5 mr-1.5" />
                    <span className="text-sm font-medium">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition duration-200 flex items-center ${viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    aria-label="Ver em lista"
                  >
                    <FaListUl className="h-5 w-5 mr-1.5" />
                    <span className="text-sm font-medium">Lista</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-medium rounded-lg shadow-sm hover:shadow transition duration-200"
                >
                  <FaFilter className="h-5 w-5" />
                  <span>{showFilters ? 'Ocultar filtros' : 'Filtros'}</span>
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-orange-600 bg-white rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <ProductFilters
              showFilters={showFilters}
              availableBrands={availableBrands}
              availableCategories={availableCategories}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              maxPrice={maxPrice}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onBrandToggle={handleBrandToggle}
              onCategoryToggle={handleCategoryToggle}
              onPriceChange={handlePriceChange}
              onSortByChange={setSortBy}
              onSortDirectionToggle={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              resetFilters={resetFilters}
            />
          </div>

          {isLoading ? (
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <Loading />
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-xl text-center border border-red-200 dark:border-red-800/30 mx-4 sm:mx-6 lg:mx-8">
              <TbAlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Erro ao carregar produtos</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{filteredProducts.length}</span> produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                  {activeFiltersCount > 0 ? ' para os filtros aplicados' : ''}
                  {searchTerm.trim() !== '' ?
                    <span> para &quot;<span className="font-medium text-orange-600 dark:text-orange-400">{searchTerm}</span>&quot;</span>
                    : ''}
                </div>
                {sortBy !== 'none' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Ordenado por:</span> {sortBy === 'name' ? 'Nome' : sortBy === 'price' ? 'Preço' : 'Marca'} ({sortDirection === 'asc' ? 'crescente' : 'decrescente'})
                  </div>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <BiSad className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-lg font-medium">Nenhum produto encontrado</p>
                  <p className="text-sm mt-2">Tente ajustar seus filtros ou buscar por outro termo</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div
                  className={viewMode === 'grid'
                    ? "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    : "space-y-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-item"
                    >
                      <ProductCard
                        product={product}
                        viewMode={viewMode}
                        imageStatus={imageStatuses[product.id] || 'loading'}
                        onEdit={handleEdit}
                        onImageError={() => handleImageStatus(product.id, 'error')}
                        onImageLoad={() => handleImageStatus(product.id, 'loaded')}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          isOpen={isModalOpen}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleChange}
          onImageChange={handleImageChange}
        />
      )}
    </div>
  );
}