/** Skeleton loader for product cards */
export const ProductCardSkeleton = () => (
  <div className="product-card-skeleton">
    <div className="skeleton" style={{ height: '240px', borderRadius: '0.75rem 0.75rem 0 0' }} />
    <div className="product-card-skeleton__body">
      <div className="skeleton" style={{ height: '12px', width: '60%' }} />
      <div className="skeleton" style={{ height: '20px', width: '80%' }} />
      <div className="skeleton" style={{ height: '16px', width: '40%' }} />
      <div className="skeleton" style={{ height: '40px', marginTop: '0.5rem' }} />
    </div>
  </div>
);

/** Skeleton for a grid of product cards */
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid-products">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/** Generic block skeleton */
export const Skeleton = ({
  height = '1rem',
  width = '100%',
  className = '',
}: {
  height?: string;
  width?: string;
  className?: string;
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ height, width }}
    aria-hidden="true"
  />
);
