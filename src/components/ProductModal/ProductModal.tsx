import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, ArrowLeftRight } from 'lucide-react';
import { Product } from '../../types/product';
import styles from './ProductModal.module.scss';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatPrice = () => {
    if (typeof product.price === 'string') {
      const numPrice = parseFloat(product.price);
      return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
    }
    return (product.price as number).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Data indisponível';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.modalOverlay}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={handleBackdropClick}
      >
        <motion.div 
          className={styles.modal}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={styles.modalHeader}>
            <h2>{product.name}</h2>
            <motion.button 
              className={styles.closeButton} 
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.productImage}>
              <img 
                src={product.image_url || '/placeholder-image.jpg'} 
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
            
            <div className={styles.productDetails}>
              <div className={styles.priceSection}>
                <div className={styles.price}>R$ {formatPrice()}</div>
                <div className={styles.availability}>
                  {product.stock > 0 ? (
                    <span className={styles.inStock}>Em estoque</span>
                  ) : (
                    <span className={styles.outOfStock}>Indisponível</span>
                  )}
                </div>
              </div>
              
              <div className={styles.ratingSection}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < 4 ? "#ffc107" : "none"} 
                      color={i < 4 ? "#ffc107" : "#e2e2e2"} 
                    />
                  ))}
                </div>
                <span className={styles.reviews}>(4.0/5 - 12 avaliações)</span>
              </div>
              
              <div className={styles.description}>
                <h3>Descrição</h3>
                <p>{product.description || 'Sem descrição disponível.'}</p>
              </div>
              
              <div className={styles.metadata}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>ID do Produto:</span>
                  <span>{product.id}</span>
                </div>
                
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Adicionado em:</span>
                  <span>{formatDate(product.created_at)}</span>
                </div>
                
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Última atualização:</span>
                  <span>{formatDate(product.updated_at)}</span>
                </div>
              </div>
              
              {product.stock > 0 && (
                <div className={styles.purchaseSection}>
                  <div className={styles.quantitySelector}>
                    <button 
                      className={styles.quantityButton} 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className={styles.quantityInput}
                    />
                    <button 
                      className={styles.quantityButton} 
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className={styles.stock}>
                    {product.stock} unidades disponíveis
                  </div>
                </div>
              )}
              
              <div className={styles.actionsSection}>
                <motion.button 
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={20} />
                  Adicionar ao Carrinho
                </motion.button>
                
                <div className={styles.secondaryActions}>
                  <motion.button 
                    className={styles.wishlistButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={18} />
                    Favoritar
                  </motion.button>
                  
                  <motion.button 
                    className={styles.compareButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowLeftRight size={18} />
                    Comparar
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;