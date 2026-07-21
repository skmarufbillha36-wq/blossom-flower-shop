'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge, orderStatusVariant } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { router.push('/'); return; }

    Promise.all([
      api.get('/orders/admin/all'),
      api.get('/products?limit=1'),
    ])
      .then(([ordersRes, productsRes]) => {
        const allOrders = ordersRes.data.data ?? [];
        setOrders(allOrders.slice(0, 10)); // Show latest 10
        setStats({
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter((o: any) => o.status === 'PENDING').length,
          totalProducts: productsRes.data.pagination?.total ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, isAdmin, router]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await api.put(`/orders/admin/${orderId}/status`, { status });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <>
      <Header />
      <main id="main-content" className="admin-page">
        <div className="container">
          <div className="admin-header">
            <h1 className="page-title font-display">Admin Dashboard</h1>
            <div className="admin-header__actions">
              <Link href="/admin/products" className="btn btn-primary btn-sm" id="admin-manage-products-btn">
                + Add Product
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="stats-grid" role="list" aria-label="Dashboard statistics">
              <div className="stat-card" role="listitem">
                <div className="stat-card__icon" aria-hidden="true">📦</div>
                <div className="stat-card__value">{stats.totalOrders}</div>
                <div className="stat-card__label">Total Orders</div>
              </div>
              <div className="stat-card stat-card--warning" role="listitem">
                <div className="stat-card__icon" aria-hidden="true">⏳</div>
                <div className="stat-card__value">{stats.pendingOrders}</div>
                <div className="stat-card__label">Pending Orders</div>
              </div>
              <div className="stat-card" role="listitem">
                <div className="stat-card__icon" aria-hidden="true">🌸</div>
                <div className="stat-card__value">{stats.totalProducts}</div>
                <div className="stat-card__label">Products Listed</div>
              </div>
            </div>
          )}

          {/* Recent Orders Table */}
          <section className="admin-section" aria-labelledby="orders-table-heading">
            <h2 id="orders-table-heading" className="admin-section__title">
              Recent Orders
            </h2>

            {isLoading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="empty-text">No orders yet.</p>
            ) : (
              <div className="table-wrapper" role="region" aria-label="Orders table" tabIndex={0}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <code className="order-id-code">
                            #{order.id.slice(-8).toUpperCase()}
                          </code>
                        </td>
                        <td>
                          <div className="admin-table__customer">
                            <span>{order.user?.name}</span>
                            <span className="admin-table__customer-email">{order.user?.email}</span>
                          </div>
                        </td>
                        <td>{order.items?.length} item(s)</td>
                        <td><strong>${Number(order.totalPrice).toFixed(2)}</strong></td>
                        <td>
                          <Badge variant={orderStatusVariant(order.status)}>
                            {order.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td>
                          <select
                            id={`admin-status-${order.id}`}
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="admin-status-select"
                            aria-label={`Update status for order #${order.id.slice(-8)}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
