const FEATURES = [
  {
    icon: '🌿',
    title: 'Always Fresh',
    description: 'Every bouquet is assembled fresh on the day of delivery using premium seasonal flowers.',
  },
  {
    icon: '🚚',
    title: 'Same-Day Delivery',
    description: 'Order before 2 PM and receive your flowers the same day, right to your doorstep.',
  },
  {
    icon: '✂️',
    title: 'Custom Arrangements',
    description: 'Design your own bouquet with our easy custom builder — your vision, our expertise.',
  },
  {
    icon: '💚',
    title: 'Eco-Friendly',
    description: 'We use sustainably sourced flowers and 100% recyclable packaging.',
  },
];

/** Why choose us section with feature grid */
export const WhyUsSection = () => {
  return (
    <section className="section why-section" aria-labelledby="why-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Why Blossom?</span>
          <h2 id="why-heading" className="section-title font-display">
            The Blossom Difference
          </h2>
        </div>

        <div className="why-grid">
          {FEATURES.map((feature, i) => (
            <div key={i} className="why-card animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="why-card__icon" aria-hidden="true">{feature.icon}</div>
              <h3 className="why-card__title">{feature.title}</h3>
              <p className="why-card__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
