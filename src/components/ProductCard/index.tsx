import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../../types/product';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    }
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart }) => {
  if (!product) {
    return null;
  }

  const handleViewDetails = () => {
    if (product && onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAddToCart = () => {
    if (product && onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = () => {
    if (typeof product.price === 'string') {
      const numPrice = parseFloat(product.price);
      return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
    }
    return (product.price as number).toFixed(2);
  };

  return (
    <motion.div 
      className={styles.productCard}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <div className={styles.productImage}>
        <img 
          src={product.image_url || '/placeholder-image.jpg'} 
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
          }}
        />
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>
          R$ {formatPrice()}
        </div>
        <div className={styles.productStock}>
          Estoque: {product.stock}
        </div>
      </div>
      
      <div className={styles.productActions}>
        <motion.button 
          className={styles.detailsButton}
          onClick={handleViewDetails}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Eye size={18} />
          Detalhes
        </motion.button>
        
        <motion.button 
          className={styles.buyButton}
          onClick={handleAddToCart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={18} />
          Comprar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;