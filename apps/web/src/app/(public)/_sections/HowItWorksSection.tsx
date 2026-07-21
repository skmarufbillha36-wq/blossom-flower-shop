/** How it Works — 3-step delivery process */
export const HowItWorksSection = () => {
  const steps = [
    {
      icon: '🛍️',
      step: '01',
      title: 'Browse & Choose',
      description: 'Explore hundreds of handcrafted arrangements or build your own custom bouquet.',
    },
    {
      icon: '💳',
      step: '02',
      title: 'Order Securely',
      description: 'Place your order with ease. We accept all major payment methods.',
    },
    {
      icon: '🚚',
      step: '03',
      title: 'Same-Day Delivery',
      description: 'Your fresh flowers are arranged and delivered to your door the same day.',
    },
  ];

  return (
    <section className="section how-section" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Simple Process</span>
          <h2 id="how-heading" className="section-title font-display">How It Works</h2>
          <p className="section-description">From click to bouquet in just a few steps</p>
        </div>

        <div className="how-grid">
          {steps.map((step, i) => (
            <div key={i} className="how-card">
              <div className="how-card__step">{step.step}</div>
              <div className="how-card__icon">{step.icon}</div>
              <h3 className="how-card__title">{step.title}</h3>
              <p className="how-card__description">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="how-card__connector" aria-hidden="true">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
