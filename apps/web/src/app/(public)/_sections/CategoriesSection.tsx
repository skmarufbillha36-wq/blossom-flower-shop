import Link from 'next/link';

const CATEGORIES = [
  { emoji: '🌹', name: 'Roses',      slug: 'roses',      description: 'Classic romance' },
  { emoji: '🌷', name: 'Tulips',     slug: 'tulips',     description: 'Spring freshness' },
  { emoji: '🌻', name: 'Sunflowers', slug: 'sunflowers', description: 'Bright & joyful' },
  { emoji: '💐', name: 'Bouquets',   slug: 'bouquets',   description: 'Mixed arrangements' },
  { emoji: '🌸', name: 'Cherry Blossom', slug: 'cherry-blossom', description: 'Delicate beauty' },
  { emoji: '🪷', name: 'Lotus',      slug: 'lotus',      description: 'Pure elegance' },
];

/** Category grid for quick browsing by flower type */
export const CategoriesSection = () => {
  return (
    <section className="section categories-section" aria-labelledby="categories-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Browse by Type</span>
          <h2 id="categories-heading" className="section-title font-display">
            Shop by Category
          </h2>
          <p className="section-description">
            Find the perfect flowers for any occasion
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="category-card"
              id={`category-${cat.slug}`}
              aria-label={`Browse ${cat.name}`}
            >
              <div className="category-card__emoji" aria-hidden="true">
                {cat.emoji}
              </div>
              <h3 className="category-card__name">{cat.name}</h3>
              <p className="category-card__desc">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
