'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CartItem } from '@flower-shop/types';

export default function CartPage() {
  const router = useRouter();
  const { cart, itemCount, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <main id="main-content" className="cart-page">
        <div className="container">
          <h1 className="page-title font-display">
            Shopping Cart
            {itemCount > 0 && <span className="page-title__count">({itemCount} items)</span>}
          </h1>

          {isLoading ? (
            <div className="cart-layout">
              <div className="cart-items">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="cart-item-skeleton">
                    <Skeleton height="80px" width="80px" />
                    <div style={{ flex: 1 }}>
                      <Skeleton height="16px" width="60%" />
                      <Skeleton height="14px" width="30%" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="empty-state empty-state--centered">
              <span className="empty-state__icon" aria-hidden="true">🛒</span>
              <h2>Your cart is empty</h2>
              <p>Add some beautiful flowers to get started!</p>
              <Link href="/shop" className="btn btn-primary btn-lg" id="cart-shop-btn">
                Browse Flowers
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <section className="cart-items" aria-label="Cart items">
                <div className="cart-items__header">
                  <h2 className="sr-only">Your items</h2>
                  <button
                    onClick={() => clearCart()}
                    className="cart-clear-btn"
                    id="cart-clear-btn"
                    aria-label="Clear entire cart"
                  >
                    Clear All
                  </button>
                </div>

                <ul className="cart-list" role="list">
                  {cart.items.map((item: CartItem) => (
                    <li key={item.id} className="cart-item animate-fade-in">
                      {/* Product Image */}
                      <div className="cart-item__image">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                          />
                        ) : (
                          <span className="cart-item__emoji" aria-hidden="true">🌸</span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="cart-item__info">
                        <Link href={`/products/${item.productId}`} className="cart-item__name">
                          {item.product.name}
                        </Link>
                        <span className="cart-item__unit-price">
                          ${Number(item.product.price).toFixed(2)} each
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart-item__quantity" role="group" aria-label={`Quantity for ${item.product.name}`}>
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                          id={`cart-decrease-${item.id}`}
                        >
                          −
                        </button>
                        <span className="qty-value" aria-live="polite">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                          id={`cart-increase-${item.id}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="cart-item__total">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="cart-item__remove"
                        aria-label={`Remove ${item.product.name} from cart`}
                        id={`cart-remove-${item.id}`}
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Order Summary */}
              <aside className="cart-summary" aria-label="Order summary">
                <h2 className="cart-summary__title">Order Summary</h2>

                <dl className="cart-summary__details">
                  <div className="cart-summary__row">
                    <dt>Subtotal ({itemCount} items)</dt>
                    <dd>${cart.totalPrice.toFixed(2)}</dd>
                  </div>
                  <div className="cart-summary__row">
                    <dt>Delivery</dt>
                    <dd className="cart-summary__free">Free</dd>
                  </div>
                  <div className="cart-summary__row cart-summary__row--total">
                    <dt>Total</dt>
                    <dd>${cart.totalPrice.toFixed(2)}</dd>
                  </div>
                </dl>

                <Link
                  href="/checkout"
                  className="btn btn-primary btn-lg cart-summary__checkout"
                  id="cart-checkout-btn"
                >
                  Proceed to Checkout
                  <ArrowIcon />
                </Link>

                <Link href="/shop" className="cart-summary__continue" id="cart-continue-shopping">
                  ← Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
