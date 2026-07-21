'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─── Testimonials data ──────────────────────────────────── */
const REVIEWS = [
  {
    text: 'The roses arrived fresh and beautifully arranged. I was amazed at the quality.',
    author: 'Sarah M.',
    stars: 5,
  },
  {
    text: 'Ordered for my wife\'s birthday — she cried happy tears. Stunning arrangement.',
    author: 'James K.',
    stars: 5,
  },
  {
    text: 'Same-day delivery worked perfectly. The bouquet was exactly as pictured.',
    author: 'Layla A.',
    stars: 5,
  },
];

/** Hook that adds .is-visible when element enters viewport */
function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export const TestimonialsSection = () => {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="section testimonials-section reveal-section" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Happy Customers</span>
          <h2 id="testimonials-heading" className="section-title font-display">
            What People Are Saying
          </h2>
        </div>
        <div className="testimonials-grid">
          {REVIEWS.map((r, i) => (
            <blockquote key={i} className="testimonial-card" style={{ '--delay': `${i * 120}ms` } as React.CSSProperties}>
              <div className="testimonial-card__stars" aria-label={`${r.stars} out of 5 stars`}>
                {'★'.repeat(r.stars)}
              </div>
              <p className="testimonial-card__text">&ldquo;{r.text}&rdquo;</p>
              <footer className="testimonial-card__author">— {r.author}</footer>
            </blockquote>
          ))}
        </div>
        <div className="testimonials-cta">
          <Link href="/shop" className="hero__btn--primary">
            Explore Collection →
          </Link>
        </div>
      </div>
    </section>
  );
};
