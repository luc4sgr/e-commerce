import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  ShoppingCart, 
  User, 
  LogOut
} from 'lucide-react';
import styles from './Topbar.module.scss';
import { authService } from '../../services/auth.service';
import { notificationService } from '../../services/notification.service';

interface TopbarProps {
  onMenuToggle: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const user = authService.getCurrentUser();
  const [notifications, setNotifications] = React.useState(3); 
  const [cartItems, setCartItems] = React.useState(2); 

  const handleLogout = () => {
    notificationService.info("Saindo do sistema", "Você será redirecionado para a tela de login.");
    setTimeout(() => {
      authService.logout();
    }, 1500);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarContent}>
        <motion.button 
          className={styles.menuToggle} 
          onClick={onMenuToggle}
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={24} />
        </motion.button>

        <div className={styles.searchContainer}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar no sistema..." 
          />
        </div>

        <div className={styles.userSection}>
          <div className={styles.actions}>
            <motion.button 
              className={styles.actionButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                notificationService.info("Notificações", `Você tem ${notifications} notificações não lidas.`);
              }}
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className={styles.badge}>{notifications}</span>
              )}
            </motion.button>
            
            <motion.button 
              className={styles.actionButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                notificationService.info("Carrinho", `Você tem ${cartItems} itens no carrinho.`);
              }}
            >
              <ShoppingCart size={20} />
              {cartItems > 0 && (
                <span className={styles.badge}>{cartItems}</span>
              )}
            </motion.button>
          </div>
          
          <div className={styles.userInfo}>
            <User size={20} />
            <span>{user?.name || 'Usuário'}</span>
          </div>
          
          <motion.button 
            className={styles.logoutButton} 
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
            Sair
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;