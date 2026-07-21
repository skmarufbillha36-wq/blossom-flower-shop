'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: string | number;
  imageUrl?: string;
  isFeatured?: boolean;
  category?: { name: string };
}

export const BestSellersSection = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/products?limit=10&page=1')
      .then((res) => setProducts(res.data.data ?? []))
      .catch(() => setProducts([]));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  /* Loading skeleton */
  if (products === null) {
    return (
      <section className="section bestsellers-section" aria-label="Loading best sellers">
        <div className="container">
          <div className="bestsellers-header">
            <div>
              <span className="section-eyebrow">🔥 Most Popular</span>
              <div className="h-8 w-40 bg-gray-200 animate-pulse rounded mt-2" />
            </div>
          </div>
          <div className="bestsellers-track">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bestseller-card" style={{ minWidth: 220, pointerEvents: 'none' }}>
                <div className="bestseller-card__image bg-gray-100 animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-3" />
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mt-2" />
                <div className="h-4 w-16 bg-gray-300 animate-pulse rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="section bestsellers-section" aria-labelledby="bestsellers-heading">
      <div className="container">
        <div className="bestsellers-header">
          <div>
            <span className="section-eyebrow">🔥 Most Popular</span>
            <h2 id="bestsellers-heading" className="section-title font-display" style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              Best Sellers
            </h2>
          </div>
          <div className="bestsellers-nav">
            <button
              id="bestsellers-prev"
              onClick={() => scroll('left')}
              className="scroll-arrow"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              id="bestsellers-next"
              onClick={() => scroll('right')}
              className="scroll-arrow"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        <div className="bestsellers-track" ref={scrollRef}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bestseller-card"
              id={`bestseller-${product.id}`}
            >
              <div className="bestseller-card__image">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.name} className="bestseller-card__img" />
                ) : (
                  <span className="bestseller-card__placeholder">🌸</span>
                )}
              </div>
              {product.category ? (
                <span className="bestseller-card__category">{product.category.name}</span>
              ) : null}
              <h3 className="bestseller-card__name">{product.name}</h3>
              <p className="bestseller-card__price">${Number(product.price).toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
