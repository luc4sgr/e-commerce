import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumbs.module.scss';

interface CustomBreadcrumb {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  customBreadcrumbs?: CustomBreadcrumb[];
}

const routeMap: Record<string, string> = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'products': 'Produtos',
  'orders': 'Pedidos',
  'profile': 'Perfil',
  'admin': 'Admin',
  'users': 'Usuários'
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customBreadcrumbs }) => {
  const location = useLocation();

  if (customBreadcrumbs && customBreadcrumbs.length > 0) {
    return (
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          <li className={styles.breadcrumbItem}>
            <Link to="/dashboard">
              <Home size={16} /> Home
            </Link>
          </li>
          {customBreadcrumbs.map((crumb, index) => (
            <li 
              key={index} 
              className={`${styles.breadcrumbItem} ${index === customBreadcrumbs.length - 1 ? styles.active : ''}`}
            >
              <ChevronRight size={14} className={styles.separator} />
              {index === customBreadcrumbs.length - 1 ? (
                <span>{crumb.label}</span>
              ) : (
                <Link to={crumb.path}>{crumb.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    return null;
  }
  
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol>
        <li className={styles.breadcrumbItem}>
          <Link to="/dashboard">
            <Home size={16} /> Home
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const url = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
        
          const displayName = routeMap[value] || value;
          
          return (
            <li 
              key={url} 
              className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}
            >
              <ChevronRight size={14} className={styles.separator} />
              {isLast ? (
                <span>{displayName}</span>
              ) : (
                <Link to={url}>{displayName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;