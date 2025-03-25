import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { notificationService } from '../../services/notification.service';
import PageContainer from '../../components/PageContainer';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../types/product';
import styles from './Products.module.scss';
import ProductModal from '../../components/ProductModal/ProductModal';

const Products: React.FC = () => {

  const isMounted = useRef(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Efeito para limpeza ao desmontar
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        
        if (isMounted.current) {
          setProducts(response.data);
          setFilteredProducts(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        if (isMounted.current) {
          setError('Erro ao carregar produtos. Tente novamente.');
          notificationService.error(
            'Falha ao carregar produtos',
            'Não foi possível buscar os produtos. Verifique sua conexão.'
          );
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchProducts();
  }, []);


  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let filtered = [...products];
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice.trim()) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {

        filtered = filtered.filter(product => {
          const productPrice = typeof product.price === 'string' 
            ? parseFloat(product.price) 
            : product.price;
          return !isNaN(productPrice) && productPrice >= min;
        });
      }
    }
    
    if (maxPrice.trim()) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {

        filtered = filtered.filter(product => {
          const productPrice = typeof product.price === 'string' 
            ? parseFloat(product.price) 
            : product.price;
          return !isNaN(productPrice) && productPrice <= max;
        });
      }
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, minPrice, maxPrice, products]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao carregar produtos. Tente novamente.');
      notificationService.error(
        'Falha ao carregar produtos',
        'Não foi possível buscar os produtos. Verifique sua conexão.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    notificationService.success(
      'Produto adicionado',
      `${product.name} foi adicionado ao carrinho.`
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
  };

  const FiltersContent = () => (
    <motion.div 
      className={styles.filtersContainer}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.filtersForm}>
        <div className={styles.filterGroup}>
          <label htmlFor="minPrice">Preço Mínimo</label>
          <input
            id="minPrice"
            type="text"
            placeholder="R$ 0,00"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="maxPrice">Preço Máximo</label>
          <input
            id="maxPrice"
            type="text"
            placeholder="R$ 9.999,99"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        
        <motion.button 
          type="button"
          className={styles.clearButton}
          onClick={handleClearFilters}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Limpar Filtros
        </motion.button>
      </div>
    </motion.div>
  );

  const pageActions = (
    <div className={styles.pageActions}>
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <motion.button 
        className={styles.filterButton}
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter size={18} />
        Filtros
      </motion.button>
    </div>
  );

  return (
    <PageContainer 
      title="Produtos" 
      actions={pageActions}
    >
      <AnimatePresence>
        {isFiltersVisible && <FiltersContent />}
      </AnimatePresence>
      
      <div className={styles.resultsInfo}>
        <span>Exibindo {filteredProducts.length} de {products.length} produtos</span>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando produtos...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <motion.button 
            className={styles.retryButton}
            onClick={handleRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tentar Novamente
          </motion.button>
        </div>
      ) : (
        <ProductGrid 
          products={filteredProducts}
          onViewDetails={handleViewProduct}
          onAddToCart={handleAddToCart}
        />
      )}
      
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Products;

const MOCK_PRODUCTS = [
    {
      id: 1,
      name: "Mouse Gamer RGB",
      description: "Mouse gamer com iluminação RGB e DPI ajustável",
      price: 99.99,
      stock: 50,
      image_url: "https://picsum.photos/id/1/200/200"
    },
    {
      id: 2,
      name: "Monitor Acer K4Y",
      description: "Monitor 24 polegadas Full HD com tela IPS",
      price: 889.90,
      stock: 3,
      image_url: "https://picsum.photos/id/2/200/200"
    },
    {
      id: 3,
      name: "Fone de Ouvido Sony",
      description: "Fone de ouvido com cancelamento de ruído",
      price: 889.90,
      stock: 3,
      image_url: "https://picsum.photos/id/3/200/200"
    },
    {
      id: 4,
      name: "Teclado Mecânico",
      description: "Teclado mecânico com switches Cherry MX",
      price: 349.90,
      stock: 15,
      image_url: "https://picsum.photos/id/4/200/200"
    },
    {
      id: 5,
      name: "Webcam HD",
      description: "Webcam HD 1080p com microfone integrado",
      price: 199.90,
      stock: 7,
      image_url: "https://picsum.photos/id/5/200/200"
    }
  ];
  