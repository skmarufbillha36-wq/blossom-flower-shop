'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    address: '',
    city: '',
    scheduledAt: '',
    deliveryNotes: '',
    orderNotes: '',
  });

  // Get minimum date-time (tomorrow 9 AM)
  const minDateTime = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  })();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.address.trim() || !form.city.trim() || !form.scheduledAt) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/orders', {
        notes: form.orderNotes,
        delivery: {
          address: form.address,
          city: form.city,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          notes: form.deliveryNotes,
        },
      });

      clearCart();
      setSuccess(true);
      setTimeout(() => router.push('/orders'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Order failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main id="main-content" className="checkout-page">
          <div className="checkout-success animate-scale-in">
            <div className="checkout-success__icon" aria-hidden="true">🎉</div>
            <h1 className="checkout-success__title font-display">Order Placed!</h1>
            <p className="checkout-success__message">
              Thank you for your order! We&apos;ll confirm it shortly and prepare your flowers with care.
            </p>
            <p className="checkout-success__redirect">Redirecting to your orders...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className="checkout-page">
        <div className="container">
          <h1 className="page-title font-display">Checkout</h1>

          <div className="checkout-layout">
            {/* Form */}
            <form onSubmit={handleSubmit} className="checkout-form" noValidate>
              {error && (
                <div className="auth-error" role="alert">
                  <span aria-hidden="true">⚠️</span> {error}
                </div>
              )}

              {/* Delivery Details */}
              <section className="checkout-section" aria-labelledby="delivery-heading">
                <h2 id="delivery-heading" className="checkout-section__title">
                  🚚 Delivery Details
                </h2>

                <div className="form-group">
                  <label htmlFor="checkout-address" className="form-label">Delivery Address *</label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="form-input"
                    placeholder="123 Main Street, Apartment 4B"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-city" className="form-label">City *</label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="form-input"
                    placeholder="Ankara"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-datetime" className="form-label">Preferred Delivery Date & Time *</label>
                  <input
                    id="checkout-datetime"
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                    className="form-input"
                    min={minDateTime}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-delivery-notes" className="form-label">
                    Delivery Notes <span className="form-label__optional">(optional)</span>
                  </label>
                  <textarea
                    id="checkout-delivery-notes"
                    value={form.deliveryNotes}
                    onChange={(e) => setForm({ ...form, deliveryNotes: e.target.value })}
                    className="form-input form-textarea"
                    placeholder="Ring the doorbell, leave at the door..."
                    rows={3}
                  />
                </div>
              </section>

              {/* Order Notes */}
              <section className="checkout-section" aria-labelledby="order-notes-heading">
                <h2 id="order-notes-heading" className="checkout-section__title">
                  📝 Order Notes
                </h2>
                <div className="form-group">
                  <label htmlFor="checkout-order-notes" className="form-label">
                    Special Instructions <span className="form-label__optional">(optional)</span>
                  </label>
                  <textarea
                    id="checkout-order-notes"
                    value={form.orderNotes}
                    onChange={(e) => setForm({ ...form, orderNotes: e.target.value })}
                    className="form-input form-textarea"
                    placeholder="Any special requests for your arrangement..."
                    rows={3}
                  />
                </div>
              </section>

              <button
                id="checkout-submit-btn"
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg checkout-form__submit"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-sm" aria-hidden="true" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order — $${cart?.totalPrice?.toFixed(2) ?? '0.00'}`
                )}
              </button>
            </form>

            {/* Order Summary */}
            <aside className="checkout-summary" aria-label="Order summary">
              <h2 className="cart-summary__title">Your Order</h2>
              {cart?.items?.map((item: any) => (
                <div key={item.id} className="checkout-summary__item">
                  <span className="checkout-summary__item-name">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="checkout-summary__item-price">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="checkout-summary__total">
                <span>Total</span>
                <span>${cart?.totalPrice?.toFixed(2) ?? '0.00'}</span>
              </div>
              <p className="checkout-summary__payment-note">
                💵 Payment is collected on delivery (cash or card)
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
