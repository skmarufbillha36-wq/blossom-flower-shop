'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/features/catalog/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api';
import { Product, Category } from '@flower-shop/types';

/* ─── Price filter data ────────────────────────────────── */
const PRICE_RANGES = [
  { label: 'Under $20',  value: 'under20'  },
  { label: '$20 - $50',  value: '20to50'   },
  { label: 'Above $50',  value: 'above50'  },
];


export default function ShopPage() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [categories, setCategories]       = useState<Category[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [search, setSearch]               = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);


  /* Fetch categories once */
  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data ?? [])).catch(() => {});
  }, []);

  /* Fetch products on filter changes */
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: '12',
      ...(search && { search }),
      ...(selectedCategory && { categoryId: selectedCategory }),
    });
    api.get(`/products?${params}`, { signal: controller.signal })
      .then((res) => {
        setProducts(res.data.data ?? []);
        setTotalPages(res.data.pagination?.totalPages ?? 1);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [search, selectedCategory, currentPage]);

  /* Price filter — applied client-side on fetched products */
  const filteredProducts = products.filter((p) => {
    if (selectedPrices.length === 0) return true;
    const price = Number(p.price);
    return selectedPrices.some((range) => {
      if (range === 'under20')  return price < 20;
      if (range === '20to50')   return price >= 20 && price <= 50;
      if (range === 'above50')  return price > 50;
      return true;
    });
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedPrices([]);
    setCurrentPage(1);
  };

  const togglePrice = (v: string) =>
    setSelectedPrices((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  return (
    <>
      <Header />
      <main id="main-content">
        {/* ── Shop Layout ─────────────────────────────── */}
        <div className="shop-page-layout">

          {/* ══ LEFT SIDEBAR ═══════════════════════════ */}
          <aside className="shop-sidebar-new" aria-label="Product filters">

            {/* Search */}
            <div className="shop-filter-group">
              <h3 className="shop-filter-label">SEARCH</h3>
              <div className="shop-search-wrap">
                <input
                  id="shop-search"
                  type="search"
                  placeholder="Search flowers..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="shop-search-input"
                  aria-label="Search products"
                />
                <span className="shop-search-icon" aria-hidden="true">🔍</span>
              </div>
            </div>

            {/* Category */}
            <div className="shop-filter-group">
              <h3 className="shop-filter-label">CATEGORY</h3>
              <ul className="shop-cat-list" role="radiogroup" aria-label="Filter by category">
                <li>
                  <button
                    className={`shop-cat-item ${selectedCategory === '' ? 'shop-cat-item--active' : ''}`}
                    onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                    aria-pressed={selectedCategory === ''}
                  >
                    All Flowers
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      id={`filter-cat-${cat.id}`}
                      className={`shop-cat-item ${selectedCategory === cat.id ? 'shop-cat-item--active' : ''}`}
                      onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                      aria-pressed={selectedCategory === cat.id}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="shop-filter-group">
              <h3 className="shop-filter-label">PRICE RANGE</h3>
              <ul className="shop-price-list">
                {PRICE_RANGES.map((pr) => (
                  <li key={pr.value}>
                    <label className="shop-price-item">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(pr.value)}
                        onChange={() => togglePrice(pr.value)}
                        className="shop-price-checkbox"
                      />
                      {pr.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>


            {/* Clear */}
            <button onClick={clearFilters} className="shop-clear-btn" id="shop-clear-filters">
              ↺ Clear Filters
            </button>
          </aside>

          {/* ══ MAIN CONTENT ════════════════════════════ */}
          <div className="shop-main">

            {/* Banner */}
            <div className="shop-banner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/21.png" alt="" className="shop-banner__bg" aria-hidden="true" />
              <div className="shop-banner__content">
                <nav className="shop-breadcrumb" aria-label="Breadcrumb">
                  <Link href="/" className="shop-breadcrumb__link">Home</Link>
                  <span aria-hidden="true"> › </span>
                  <span>Shop</span>
                </nav>
                <h1 className="shop-banner__title font-display">Our Flowers</h1>
                <p className="shop-banner__sub">Fresh flowers, handpicked with love</p>
              </div>
            </div>


            {/* Products */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="shop-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="pagination" aria-label="Product pagination">
                    <button
                      id="pagination-prev"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination__btn"
                      aria-label="Previous page"
                    >
                      ← Prev
                    </button>
                    <span className="pagination__info" aria-live="polite">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      id="pagination-next"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination__btn"
                      aria-label="Next page"
                    >
                      Next →
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon" aria-hidden="true">🔍</span>
                <h2>No flowers found</h2>
                <p>Try a different search term or category.</p>
                <button onClick={clearFilters} className="btn btn-primary" id="shop-clear-empty">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
