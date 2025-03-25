import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  User, 
  Settings, 
  Users,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import styles from './Sidebar.module.scss';
import { authService } from '../../services/auth.service';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();
  const user = authService.getCurrentUser();

  const sections = [
    {
      title: 'Principal',
      items: [
        { 
          path: '/dashboard', 
          icon: <Home size={20} />, 
          label: 'Dashboard',
          roles: ['user', 'admin']
        },
        { 
          path: '/products', 
          icon: <Package size={20} />, 
          label: 'Produtos',
          roles: ['user', 'admin']
        },
        { 
          path: '/orders', 
          icon: <ShoppingCart size={20} />, 
          label: 'Pedidos',
          roles: ['user', 'admin']
        },
        { 
          path: '/profile', 
          icon: <User size={20} />, 
          label: 'Perfil',
          roles: ['user', 'admin']
        }
      ]
    },
    ...(isAdmin ? [
      {
        title: 'Administração',
        items: [
          { 
            path: '/admin/dashboard', 
            icon: <Settings size={20} />, 
            label: 'Admin Dashboard',
            roles: ['admin']
          },
          { 
            path: '/admin/users', 
            icon: <Users size={20} />, 
            label: 'Usuários',
            roles: ['admin']
          },
          { 
            path: '/admin/products', 
            icon: <Package size={20} />, 
            label: 'Gerenciar Produtos',
            roles: ['admin']
          },
          { 
            path: '/admin/orders', 
            icon: <ShoppingCart size={20} />, 
            label: 'Gerenciar Pedidos',
            roles: ['admin']
          }
        ]
      }
    ] : [])
  ];

  const handleLogout = () => {
    authService.logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <motion.aside 
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <div className={styles.brand}>
        <span className={styles.logo}>🛒</span>
        <span className={styles.appName}>E-Commerce</span>
      </div>

      <div className={styles.sidebarContent}>
        <nav>
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className={styles.section}>
              <motion.h3 
                className={styles.sectionTitle}
                variants={itemVariants}
              >
                {section.title}
              </motion.h3>
              <ul>
                {section.items.map((item) => (
                  <motion.li key={item.path} variants={itemVariants}>
                    <a 
                      className={`
                        ${styles.navLink} 
                        ${location.pathname === item.path ? styles.active : ''}
                      `}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <User size={16} />
        </div>
        <div>
          <div className={styles.userName}>{user?.name || 'Usuário'}</div>
          <div className={styles.userRole}>{isAdmin ? 'Administrador' : 'Cliente'}</div>
        </div>
      </div>
      
      <button 
        className={styles.closeButton} 
        onClick={onClose}
      >
        <ChevronLeft size={18} />
        Fechar Menu
      </button>
    </motion.aside>
  );
};

export default Sidebar;