import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import AppRoutes from './routes';
import './styles/main.scss';

function App() {

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by error handler:', error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '14px',
          },
          className: 'toast-custom',
        }}
        theme="light"
        richColors
        closeButton
      />
    </>
  );
}

export default App;