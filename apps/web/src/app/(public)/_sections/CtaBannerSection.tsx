import Link from 'next/link';

/** Full-width CTA banner at the bottom of the homepage */
export const CtaBannerSection = () => (
  <section className="cta-banner" aria-label="Call to action">
    <div className="container cta-banner__inner">
      <div className="cta-banner__content">
        <span className="cta-banner__eyebrow">🌹 Special Offer</span>
        <h2 className="cta-banner__title font-display">
          Build Your Dream Bouquet
        </h2>
        <p className="cta-banner__description">
          Mix and match your favourite flowers. Our custom bouquet builder lets you
          create the perfect arrangement for any occasion.
        </p>
        <div className="cta-banner__actions">
          <Link href="/bouquet-builder" className="cta-banner__btn cta-banner__btn--primary" id="cta-builder-btn">
            Start Building 💐
          </Link>
          <Link href="/shop" className="cta-banner__btn cta-banner__btn--ghost" id="cta-shop-btn">
            Browse Collection →
          </Link>
        </div>
      </div>
    </div>
  </section>
);
