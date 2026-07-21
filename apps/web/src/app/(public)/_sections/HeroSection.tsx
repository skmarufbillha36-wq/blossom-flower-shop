import Link from 'next/link';

/** Full-screen hero with real flower photo background */
export const HeroSection = () => {
  return (
    <section
      className="hero"
      aria-label="Hero"
      style={{ backgroundImage: "url('/22.png')" }}
    >
      {/* Gradient overlay: solid white on left → transparent on right */}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content animate-slide-up">
          <span className="hero__eyebrow">🌸 Fresh · Handcrafted · Delivered</span>

          <h1 className="hero__title font-display">
            Beautiful Flowers
            <br />
            <em>For Every Moment</em>
          </h1>

          <p className="hero__description">
            From intimate gifts to grand celebrations — discover handcrafted
            bouquets made with love, delivered fresh to your door.
          </p>

          <div className="hero__actions">
            <Link href="/shop" className="hero__btn hero__btn--primary" id="hero-shop-btn">
              Shop Now <ArrowIcon />
            </Link>
            <Link href="/bouquet-builder" className="hero__btn hero__btn--secondary" id="hero-builder-btn">
              Build a Bouquet
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">500+</span>
              <span className="hero__stat-label">Arrangements</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">4.9★</span>
              <span className="hero__stat-label">Customer Rating</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">Same Day</span>
              <span className="hero__stat-label">Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
