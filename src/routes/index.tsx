import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import AnimatedPage from '../components/AnimatedPage';

// Páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
// import AdminDashboard from '../pages/admin/AdminDashboard';
// import AdminProducts from '../pages/admin/AdminProducts';
// import AdminUsers from '../pages/admin/AdminUsers';
// import AdminOrders from '../pages/admin/AdminOrders';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rota pública */}
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        
        {/* Rotas privadas para usuários */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* Rota raiz redireciona para dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
            <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
          </Route>
        </Route>
        
        {/* Rotas privadas para administradores */}
        <Route element={<PrivateRoute adminOnly />}>
          <Route element={<Layout />}>
            {/* <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
            <Route path="/admin/products" element={<AnimatedPage><AdminProducts /></AnimatedPage>} />
            <Route path="/admin/users" element={<AnimatedPage><AdminUsers /></AnimatedPage>} />
            <Route path="/admin/orders" element={<AnimatedPage><AdminOrders /></AnimatedPage>} /> */}
          </Route>
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRoutes;