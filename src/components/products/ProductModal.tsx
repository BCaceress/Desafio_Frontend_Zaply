import { Product } from '@/types/product';
import { formatCurrency, parseCurrency } from '@/utils/currencyFormatter';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa';

const CATEGORIAS = [
  'Bazar E Utilidades',
  'Bebidas',
  'Carnes',
  'Flores E Plantas',
  'Frios E Congelados',
  'Hortifruti',
  'Laticínios',
  'Limpeza',
  'Mercearia',
  'Padaria',
  'Perfumaria E Beleza'
];

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Product) => void;
  onImageChange: (imageUrl: string) => void;
}

const ProductModal = ({ product, isOpen, onSave, onCancel, onChange, onImageChange }: ProductModalProps) => {
  const [isValidImage, setIsValidImage] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [localImageFile, setLocalImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.image || null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [formattedPrice, setFormattedPrice] = useState<string>(formatCurrency(product.price * 100));

  const isNewProduct = product.id < 0;

  useEffect(() => {
    setFormattedPrice(formatCurrency(product.price * 100));
    setPreviewUrl(product.image || null);
  }, [product]);

  const handleImageFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    setLocalImageFile(file);
    setPreviewUrl(objectURL);
    onImageChange(objectURL);
  }, [onImageChange]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, boolean> = {};

    if (!product.name.trim()) errors.name = true;
    if (!product.brand.trim()) errors.brand = true;
    if (!product.categories) errors.categories = true;
    if (product.price <= 0) errors.price = true;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [product.name, product.brand, product.categories, product.price]);

  const handleSaveClick = useCallback(async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    onSave();
  }, [validateForm, onSave]);

  const handlePriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/[^\d]/g, '');

    setFormattedPrice(formatCurrency(parseInt(filteredValue || '0')));
    const numericValue = parseCurrency(filteredValue);
    const valueInReais = numericValue / 100;

    onChange(
      { ...e, target: { ...e.target, value: valueInReais.toString() } },
      'price'
    );
  }, [onChange]);

  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: 'spring', bounce: 0.25 }
  };

  const selectStyles = useMemo(() => ({
    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundPosition: "right 0.5rem center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1.5em 1.5em",
    paddingRight: "2.5rem"
  }), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          {...overlayAnimation}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
            {...modalAnimation}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isNewProduct ? 'Adicionar Produto' : 'Editar Produto'}
              </h2>
              <button
                onClick={onCancel}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                aria-label="Fechar"
              >
                <FaTimes className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="h-64 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 mb-4 relative">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewUrl}
                        alt="Preview do produto"
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain p-4"
                        onError={() => setIsValidImage(false)}
                        onLoad={() => setIsValidImage(true)}
                      />
                      {!isValidImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90">
                          <div className="text-center text-gray-500 dark:text-gray-400 px-6">
                            <FaImage className="h-12 w-12 mx-auto mb-2" />
                            <p>Imagem inválida ou indisponível</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 px-6">
                      <FaUpload className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-medium">Sem imagem definida</p>
                      <p className="text-sm mt-1">Faça upload de uma imagem para o produto</p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <label className="cursor-pointer bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-sm hover:shadow flex items-center space-x-2">
                      <FaUpload className="h-4 w-4" />
                      <span>Escolher imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-4 w-full text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {localImageFile ? `Arquivo: ${localImageFile.name}` : 'Nenhum arquivo selecionado'}
                  </p>
                  <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2">
                    <FaUpload className="h-4 w-4" />
                    <span>{localImageFile ? 'Trocar imagem' : 'Upload de imagem'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => onChange(e, 'name')}
                    className={`w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">O nome é obrigatório.</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => onChange(e, 'brand')}
                    className={`w-full px-3 py-2 border ${validationErrors.brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    required
                  />
                  {validationErrors.brand && (
                    <p className="text-red-500 text-sm mt-1">A marca é obrigatória.</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={product.categories || ''}
                    onChange={(e) => onChange(e, 'categories')}
                    className={`w-full px-3 py-2 border ${validationErrors.categories ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer appearance-none`}
                    style={selectStyles}
                    required
                  >
                    <option value="" disabled>Selecione uma categoria</option>
                    {CATEGORIAS.map((categoria) => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                  {validationErrors.categories && (
                    <p className="text-red-500 text-sm mt-1">A categoria é obrigatória.</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço (R$) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                   
                    <input
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      onKeyDown={(e) => {
                        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                        if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={() => {
                        const numericValue = parseCurrency(formattedPrice);
                        setFormattedPrice(formatCurrency(numericValue));
                      }}
                      className={`w-full px-3 py-2  border ${validationErrors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      required
                    />
                  </div>
                  {validationErrors.price && (
                    <p className="text-red-500 text-sm mt-1">O preço deve ser maior que zero.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium rounded-md transition-colors duration-200"
                disabled={isSaving}
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="button"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  isNewProduct ? 'Adicionar Produto' : 'Salvar Alterações'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ProductModal);