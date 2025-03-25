import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../../utils/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      key={window.location.pathname}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;