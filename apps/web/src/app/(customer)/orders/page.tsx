'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge, orderStatusVariant } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { Order } from '@flower-shop/types';
import api from '@/lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    api.get('/orders')
      .then((res) => setOrders(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, router]);

  return (
    <>
      <Header />
      <main id="main-content" className="orders-page">
        <div className="container">
          <h1 className="page-title font-display">My Orders</h1>

          {isLoading ? (
            <div className="orders-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="order-card-skeleton">
                  <Skeleton height="24px" width="30%" />
                  <Skeleton height="16px" width="50%" />
                  <Skeleton height="16px" width="20%" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state empty-state--centered">
              <span className="empty-state__icon" aria-hidden="true">📦</span>
              <h2>No orders yet</h2>
              <p>Once you place an order, it will appear here.</p>
              <Link href="/shop" className="btn btn-primary" id="orders-shop-btn">
                Start Shopping
              </Link>
            </div>
          ) : (
            <ul className="orders-list" role="list">
              {orders.map((order) => (
                <li key={order.id} className="order-card animate-fade-in" role="listitem">
                  <div className="order-card__header">
                    <div>
                      <span className="order-card__id">Order #{order.id.slice(-8).toUpperCase()}</span>
                      <time className="order-card__date" dateTime={String(order.createdAt)}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </time>
                    </div>
                    <Badge variant={orderStatusVariant(order.status)}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <ul className="order-card__items" role="list">
                    {order.items.map((item) => (
                      <li key={item.id} className="order-card__item">
                        <span>{item.product?.name ?? 'Product'}</span>
                        <span>× {item.quantity}</span>
                        <span>${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="order-card__footer">
                    {order.delivery && (
                      <span className="order-card__delivery">
                        🚚 Scheduled: {new Date(order.delivery.scheduledAt).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    )}
                    <span className="order-card__total">
                      Total: <strong>${Number(order.totalPrice).toFixed(2)}</strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
