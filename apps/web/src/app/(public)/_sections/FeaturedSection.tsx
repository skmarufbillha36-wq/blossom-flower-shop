import Link from 'next/link';

/** Featured products section — data fetched server-side from API */
export const FeaturedSection = async () => {
  let products = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/featured`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    if (res.ok) {
      const json = await res.json();
      products = json.data ?? [];
    }
  } catch {
    // Silently fail — show empty state
  }

  return (
    <section className="section featured-section" aria-labelledby="featured-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Handpicked for You</span>
          <h2 id="featured-heading" className="section-title font-display">
            Featured Arrangements
          </h2>
          <p className="section-description">
            Our most loved bouquets, curated by our floral experts
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid-products">
              {products.slice(0, 4).map((product: any) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <Link href="/shop" className="btn btn-outline btn-lg" id="featured-view-all-btn">
                View All Products
                <ArrowIcon />
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">🌸</span>
            <p>Our featured collection is being refreshed. Check back soon!</p>
            <Link href="/shop" className="btn btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </section>
  );
};

/** Server-compatible product card (no client hooks) */
const FeaturedProductCard = ({ product }: { product: any }) => (
  <article className="product-card">
    <Link href={`/products/${product.id}`} className="product-card__image-wrapper">
      <div className="product-card__image-placeholder" aria-hidden="true">🌸</div>
      {product.isFeatured && (
        <span className="product-card__badge product-card__badge--featured">Featured</span>
      )}
    </Link>
    <div className="product-card__body">
      {product.category && (
        <span className="product-card__category">{product.category.name}</span>
      )}
      <Link href={`/products/${product.id}`}>
        <h3 className="product-card__name">{product.name}</h3>
      </Link>
      <div className="product-card__footer">
        <span className="product-card__price">${Number(product.price).toFixed(2)}</span>
        <Link href={`/products/${product.id}`} className="product-card__view-btn">
          View →
        </Link>
      </div>
    </div>
  </article>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
