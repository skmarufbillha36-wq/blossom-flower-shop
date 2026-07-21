'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@flower-shop/types';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

interface ProductCardProps {
  product: Product;
}

/** Single product card with hover effects, quick add to cart, and stock badge */
export const ProductCard = ({ product }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate to product page
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setIsAdding(true);
    try {
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <article className="product-card animate-scale-in">
      <Link href={`/products/${product.id}`} className="product-card__image-wrapper">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card__img-real"
          />
        ) : (
          <div className="product-card__image-placeholder" aria-hidden="true">
            🌸
          </div>
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.isFeatured && (
            <span className="product-card__badge product-card__badge--featured">Featured</span>
          )}
          {isOutOfStock && (
            <span className="product-card__badge product-card__badge--sold-out">Sold Out</span>
          )}
        </div>
      </Link>

      <div className="product-card__body">
        <Link href={`/products/${product.id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

        {product.category && (
          <span className="product-card__category">{product.category.name}</span>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">
            ${Number(product.price).toFixed(2)}
          </span>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`product-card__cart-btn ${added ? 'product-card__cart-btn--added' : ''}`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? (
              <span className="spinner-sm" aria-hidden="true" />
            ) : added ? (
              <CheckIcon />
            ) : (
              <CartAddIcon />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

/* ─── Icons ─────────────────────────────────────────────── */
const CartAddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
    <line x1="12" y1="14" x2="12" y2="20"/>
    <line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
