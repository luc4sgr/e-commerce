import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import { notificationService } from '../../services/notification.service';
import PageContainer from '../../components/PageContainer';
import styles from './Orders.module.scss';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

const statusMap = {
  pendente: {
    label: 'Pendente',
    color: '#f59e0b',
    icon: <Clock size={18} />
  },
  processando: {
    label: 'Processando',
    color: '#3b82f6',
    icon: <ShoppingBag size={18} />
  },
  enviado: {
    label: 'Enviado',
    color: '#10b981',
    icon: <ShoppingBag size={18} />
  },
  entregue: {
    label: 'Entregue',
    color: '#10b981',
    icon: <CheckCircle size={18} />
  },
  cancelado: {
    label: 'Cancelado',
    color: '#ef4444',
    icon: <XCircle size={18} />
  }
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
        setError(null);
      } catch (err: any) {
        setError('Erro ao carregar pedidos');
        notificationService.error(
          'Falha ao carregar pedidos', 
          'Verifique sua conexão com a internet e tente novamente.'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    statusMap[order.status].label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  

  const toggleOrderExpansion = (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  

  const OrderStatus: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const { label, color, icon } = statusMap[status];
    
    return (
      <div 
        className={styles.orderStatus}
        style={{ borderColor: color, color }}
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const isExpanded = expandedOrderId === order.id;
    
    return (
      <motion.div 
        className={styles.orderCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className={styles.orderHeader}
          onClick={() => toggleOrderExpansion(order.id)}
        >
          <div className={styles.orderInfo}>
            <div className={styles.orderId}>
              <FileText size={18} />
              <span>Pedido #{order.id}</span>
            </div>
            <div className={styles.orderDate}>
              <Calendar size={16} />
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>
          
          <div className={styles.orderMeta}>
            <OrderStatus status={order.status} />
            <div className={styles.orderPrice}>
              R$ {order.total_price.toFixed(2)}
            </div>
            <button className={styles.expandButton}>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <motion.div 
            className={styles.orderDetails}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.orderItems}>
              <h3>Itens do Pedido</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map(item => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>R$ {item.price.toFixed(2)}</td>
                      <td>R$ {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className={styles.totalLabel}>Total</td>
                    <td className={styles.totalValue}>R$ {order.total_price.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className={styles.orderActions}>
              <button className={styles.viewDetailsButton}>
                Ver Detalhes Completos
              </button>
              {order.status === 'pendente' && (
                <button className={styles.cancelOrderButton}>
                  Cancelar Pedido
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };
  
  const pageActions = (
    <div className={styles.searchContainer}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Buscar pedidos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );

  return (
    <PageContainer title="Meus Pedidos" actions={pageActions}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <AlertTriangle size={40} color="#ef4444" />
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <ShoppingBag size={60} color="#6c757d" />
          <h3>Nenhum pedido encontrado</h3>
          <p>
            {searchTerm 
              ? 'Nenhum pedido corresponde à sua busca. Tente outros termos.'
              : 'Você ainda não fez nenhum pedido. Que tal começar agora?'
            }
          </p>
          {!searchTerm && (
            <a href="/products" className={styles.shopNowButton}>
              Ir às Compras
            </a>
          )}
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Orders;