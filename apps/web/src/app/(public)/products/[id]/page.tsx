'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Product } from '@flower-shop/types';
import api from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => router.push('/shop'))
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setIsAdding(true);
    try {
      await addItem(product!.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product ? product.stock === 0 : false;
  const maxQty = product ? Math.min(product.stock, 10) : 1;

  return (
    <>
      <Header />
      <main id="main-content" className="product-detail-page">
        <div className="container">

          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="breadcrumb__link">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/shop" className="breadcrumb__link">Shop</Link>
            <span aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">
              {isLoading ? '...' : product?.name}
            </span>
          </nav>

          {isLoading ? (
            <div className="product-detail-layout">
              <Skeleton height="500px" className="rounded-3xl" />
              <div className="product-detail-info">
                <Skeleton height="16px" width="30%" />
                <Skeleton height="40px" width="80%" />
                <Skeleton height="32px" width="20%" />
                <Skeleton height="80px" />
                <Skeleton height="56px" />
              </div>
            </div>
          ) : product ? (
            <div className="product-detail-layout">
              {/* Product Image */}
              <div className="product-detail-image">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-detail-image__real-img"
                  />
                ) : (
                  <div className="product-detail-image__placeholder" aria-hidden="true">
                    🌸
                  </div>
                )}
                {product.isFeatured ? (
                  <div className="product-detail-image__badge">
                    <Badge variant="brand">⭐ Featured</Badge>
                  </div>
                ) : null}
              </div>

              {/* Product Info */}
              <div className="product-detail-info animate-slide-up">
                {product.category ? (
                  <Link
                    href={`/shop?categoryId=${product.categoryId}`}
                    className="product-detail-info__category"
                  >
                    {product.category.name}
                  </Link>
                ) : null}

                <h1 className="product-detail-info__title font-display">
                  {product.name}
                </h1>

                <div className="product-detail-info__price">
                  ${Number(product.price).toFixed(2)}
                </div>

                {/* Stock Status */}
                <div className="product-detail-info__stock">
                  {isOutOfStock ? (
                    <Badge variant="danger">Out of Stock</Badge>
                  ) : product.stock <= 5 ? (
                    <Badge variant="warning">Only {product.stock} left!</Badge>
                  ) : (
                    <Badge variant="success">✓ In Stock</Badge>
                  )}
                </div>

                <p className="product-detail-info__description">
                  {product.description}
                </p>

                {/* Divider */}
                <hr className="product-detail-info__divider" />

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="product-detail-info__qty-group">
                    <label htmlFor="product-qty" className="form-label">Quantity</label>
                    <div
                      className="product-detail-info__qty-control"
                      role="group"
                      aria-label="Select quantity"
                    >
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="qty-btn qty-btn--lg"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        id="product-qty"
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value))))
                        }
                        min={1}
                        max={maxQty}
                        className="product-detail-info__qty-input"
                        aria-label="Quantity"
                      />
                      <button
                        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                        disabled={quantity >= maxQty}
                        className="qty-btn qty-btn--lg"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className={`btn btn-lg product-detail-info__add-btn ${
                    added ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <span className="spinner-sm" aria-hidden="true" />
                      Adding...
                    </>
                  ) : added ? (
                    '✓ Added to Cart!'
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      🛒 Add to Cart — ${(Number(product.price) * quantity).toFixed(2)}
                    </>
                  )}
                </button>

                {/* Delivery Info */}
                <div className="product-detail-info__delivery">
                  <div className="delivery-badge">
                    <span aria-hidden="true">🚚</span>
                    <span>Free same-day delivery on orders before 2 PM</span>
                  </div>
                  <div className="delivery-badge">
                    <span aria-hidden="true">🌿</span>
                    <span>100% fresh, sustainably sourced flowers</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
