import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../Breadcrumbs';
import styles from './PageContainer.module.scss';

interface CustomBreadcrumb {
  label: string;
  path: string;
}

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  breadcrumbs?: CustomBreadcrumb[];
  actions?: React.ReactNode;
}

const containerVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  children, 
  breadcrumbs, 
  actions 
}) => {
  return (
    <motion.div 
      className={styles.pageContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Breadcrumbs customBreadcrumbs={breadcrumbs} />
      
      <div className={styles.pageHeader}>
        <h1>{title}</h1>
        {actions && (
          <div className={styles.pageActions}>
            {actions}
          </div>
        )}
      </div>
      
      <div className={styles.pageContent}>
        {children}
      </div>
    </motion.div>
  );
};

export default PageContainer;