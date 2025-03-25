import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';
import { Product } from '../../types/product';
import styles from './ProductGrid.module.scss';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onViewDetails, 
  onAddToCart 
}) => {
  if (!products) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.productGrid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id.toString()}
          product={product}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </motion.div>
  );
};

export default ProductGrid;