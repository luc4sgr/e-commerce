import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  RefreshCw
} from 'lucide-react';
import PageContainer from '../../components/PageContainer';
import styles from './Dashboard.module.scss';
import api from '../../services/api';
import { notificationService } from '../../services/notification.service';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalSales: number;
  topProducts: Array<{
    id: number;
    name: string;
    totalSold: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    topProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {

    setIsLoading(true);
    setError(null);

    fetchDashboardStats();
    

  }, [location.pathname]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      const mockDataPromise = new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              total_users: 254,
              total_orders: 1897,
              total_sales: 32450.75,
              top_products: [
                { id: 1, name: "Mouse Gamer RGB", totalSold: 352 },
                { id: 2, name: "Monitor Acer K4Y", totalSold: 197 },
                { id: 3, name: "Fone de Ouvido Sony", totalSold: 189 },
                { id: 4, name: "Teclado Mecânico", totalSold: 146 },
                { id: 5, name: "Webcam HD", totalSold: 98 }
              ]
            }
          });
        }, 800);
      });
      
      const mockResponse = await mockDataPromise;
      
      setStats({
        topProducts: mockResponse.data.top_products,
        totalOrders: mockResponse.data.total_orders,
        totalSales: mockResponse.data.total_sales,
        totalUsers: mockResponse.data.total_users
      });
      
      setError(null);
      
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar estatísticas');
      notificationService.error(
        'Falha ao carregar dados', 
        'Não foi possível buscar as estatísticas do dashboard'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    notificationService.promise(
      fetchDashboardStats(),
      {
        loading: 'Atualizando dados do dashboard...',
        success: 'Dados atualizados com sucesso!',
        error: 'Falha ao atualizar os dados'
      }
    );
  };

  const StatCard: React.FC<{
    icon: React.ReactNode, 
    title: string, 
    value: number | string,
    color: string,
    trend?: {
      value: number;
      isUp: boolean;
    }
  }> = ({ icon, title, value, color, trend }) => (
    <motion.div 
      className={styles.statCard} 
      style={{ borderTop: `3px solid ${color}` }}
      whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.statIcon} style={{ color: color }}>{icon}</div>
      <div className={styles.statContent}>
        <h3>{title}</h3>
        <p className={styles.statValue}>
          {typeof value === 'number' && title === 'Receita Total' 
            ? `R$ ${value.toFixed(2).replace('.', ',')}`
            : value
          }
        </p>
        {trend && (
          <p className={`${styles.statTrend} ${trend.isUp ? styles.up : styles.down}`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </p>
        )}
      </div>
    </motion.div>
  );

  const TopProductsTable: React.FC = () => (
    <motion.div 
      className={styles.topProductsSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2>Produtos Mais Vendidos</h2>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade Vendida</th>
              <th>% do Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product) => {
                
                const totalSold = stats.topProducts.reduce((acc, curr) => acc + curr.totalSold, 0);
                const percentage = totalSold ? ((product.totalSold / totalSold) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.totalSold}</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${percentage}%` }}
                        />
                        <span>{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>Nenhum produto encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <PageContainer title="Dashboard">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando estatísticas...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Dashboard">
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={handleRefresh}
          >
            Tentar Novamente
          </button>
        </div>
      </PageContainer>
    );
  }

  const refreshAction = (
    <motion.button 
      className={styles.refreshButton}
      onClick={handleRefresh}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RefreshCw size={18} />
      Atualizar
    </motion.button>
  );

  return (
    <PageContainer title="Dashboard" actions={refreshAction}>
      <div className={styles.statsGrid}>
        <StatCard 
          icon={<Users size={24} />} 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          color="#3b82f6" 
          trend={{ value: 12.5, isUp: true }}
        />
        <StatCard 
          icon={<ShoppingCart size={24} />} 
          title="Total de Pedidos" 
          value={stats.totalOrders} 
          color="#10b981"
          trend={{ value: 8.2, isUp: true }}
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          title="Receita Total" 
          value={stats.totalSales} 
          color="#8b5cf6"
          trend={{ value: 5.3, isUp: true }}
        />
        <StatCard 
          icon={<Package size={24} />} 
          title="Produtos Cadastrados" 
          value={stats.topProducts ? stats.topProducts.length : 0} 
          color="#f59e0b"
          trend={{ value: 2.7, isUp: false }}
        />
      </div>

      <TopProductsTable />
    </PageContainer>
  );
};

export default Dashboard;