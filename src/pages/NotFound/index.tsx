import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe ou foi movida.</p>
      <Link to="/dashboard" className={styles.backButton}>
        Voltar para o Dashboard
      </Link>
    </div>
  );
};

export default NotFound;