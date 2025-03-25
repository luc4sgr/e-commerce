import React from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p>{message}</p>
    </div>
  );
};