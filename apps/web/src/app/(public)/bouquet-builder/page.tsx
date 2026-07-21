'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/* ─── Flower Options ─────────────────────────────────────── */
const FLOWERS = [
  { id: 'rose-red',    emoji: '🌹', name: 'Red Rose',       price: 4.99  },
  { id: 'rose-pink',  emoji: '🌸', name: 'Pink Rose',       price: 4.50  },
  { id: 'tulip',      emoji: '🌷', name: 'Tulip',           price: 3.99  },
  { id: 'sunflower',  emoji: '🌻', name: 'Sunflower',       price: 3.50  },
  { id: 'daisy',      emoji: '🌼', name: 'Daisy',           price: 2.99  },
  { id: 'lily',       emoji: '💐', name: 'Lily',            price: 5.99  },
  { id: 'orchid',     emoji: '🪷', name: 'Orchid',          price: 6.99  },
  { id: 'lavender',   emoji: '💜', name: 'Lavender',        price: 3.25  },
];

const SIZES = [
  { id: 'small',  label: 'Small',  flowers: 6,  multiplier: 1.0, description: '6 stems' },
  { id: 'medium', label: 'Medium', flowers: 12, multiplier: 1.8, description: '12 stems' },
  { id: 'large',  label: 'Large',  flowers: 20, multiplier: 2.8, description: '20 stems' },
];

const WRAPPINGS = [
  { id: 'classic',  emoji: '🎀', label: 'Classic Wrap',  price: 0    },
  { id: 'premium',  emoji: '✨', label: 'Premium Box',   price: 9.99 },
  { id: 'eco',      emoji: '🌿', label: 'Eco Paper',     price: 4.99 },
  { id: 'velvet',   emoji: '💝', label: 'Velvet Ribbon', price: 7.99 },
];

interface SelectedFlower {
  flowerId: string;
  count: number;
}

export default function BouquetBuilderPage() {
  const [size, setSize] = useState(SIZES[1]);
  const [selections, setSelections] = useState<SelectedFlower[]>([]);
  const [wrapping, setWrapping] = useState(WRAPPINGS[0]);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  /* ── Helpers ─────────────────────────────────── */
  const totalFlowers = selections.reduce((s, f) => s + f.count, 0);
  const maxFlowers = size.flowers;
  const remaining = maxFlowers - totalFlowers;

  const flowersPrice = selections.reduce((sum, sel) => {
    const flower = FLOWERS.find((f) => f.id === sel.flowerId);
    return sum + (flower?.price ?? 0) * sel.count * size.multiplier;
  }, 0);
  const totalPrice = flowersPrice + wrapping.price + 5; // +5 base price

  const addFlower = (flowerId: string) => {
    if (remaining <= 0) return;
    setSelections((prev) => {
      const existing = prev.find((s) => s.flowerId === flowerId);
      if (existing) return prev.map((s) => s.flowerId === flowerId ? { ...s, count: s.count + 1 } : s);
      return [...prev, { flowerId, count: 1 }];
    });
  };

  const removeFlower = (flowerId: string) => {
    setSelections((prev) => {
      const existing = prev.find((s) => s.flowerId === flowerId);
      if (!existing || existing.count <= 0) return prev;
      if (existing.count === 1) return prev.filter((s) => s.flowerId !== flowerId);
      return prev.map((s) => s.flowerId === flowerId ? { ...s, count: s.count - 1 } : s);
    });
  };

  const getCount = (flowerId: string) =>
    selections.find((s) => s.flowerId === flowerId)?.count ?? 0;

  /* ── Preview Emojis ──────────────────────────── */
  const previewFlowers = selections.flatMap(({ flowerId, count }) => {
    const f = FLOWERS.find((fl) => fl.id === flowerId);
    return Array(count).fill(f?.emoji ?? '🌸');
  });

  return (
    <>
      <Header />
      <main id="main-content" className="builder-page">
        <div className="container">
          {/* Header */}
          <div className="builder-hero">
            <span className="section-eyebrow">Design Your Own</span>
            <h1 className="builder-hero__title font-display">Custom Bouquet Builder</h1>
            <p className="builder-hero__subtitle">
              Mix and match your favourite flowers — we&apos;ll craft it with care.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="builder-steps" role="tablist" aria-label="Builder steps">
            {(['Choose Size', 'Pick Flowers', 'Finishing'] as const).map((label, i) => (
              <div
                key={label}
                className={`builder-step ${step === i + 1 ? 'builder-step--active' : ''} ${step > i + 1 ? 'builder-step--done' : ''}`}
                role="tab"
                aria-selected={step === i + 1}
                id={`builder-step-${i + 1}`}
              >
                <div className="builder-step__num">{step > i + 1 ? '✓' : i + 1}</div>
                <span className="builder-step__label">{label}</span>
              </div>
            ))}
          </div>

          <div className="builder-layout">
            {/* ── Left Panel ─────────────────────────── */}
            <div className="builder-panel" role="tabpanel">

              {/* Step 1: Size */}
              {step === 1 && (
                <div className="builder-section animate-slide-up">
                  <h2 className="builder-section__title">Choose Your Size</h2>
                  <div className="size-options">
                    {SIZES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSize(s)}
                        className={`size-option ${size.id === s.id ? 'size-option--active' : ''}`}
                        id={`size-${s.id}`}
                        aria-pressed={size.id === s.id}
                      >
                        <div className="size-option__label">{s.label}</div>
                        <div className="size-option__desc">{s.description}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="btn btn-primary btn-lg builder-next"
                    id="builder-step1-next"
                  >
                    Next: Pick Flowers →
                  </button>
                </div>
              )}

              {/* Step 2: Flowers */}
              {step === 2 && (
                <div className="builder-section animate-slide-up">
                  <div className="builder-section__header">
                    <h2 className="builder-section__title">Pick Your Flowers</h2>
                    <span
                      className={`builder-remaining ${remaining === 0 ? 'builder-remaining--full' : ''}`}
                      aria-live="polite"
                    >
                      {remaining === 0 ? '✓ Bouquet Full!' : `${remaining} stems left`}
                    </span>
                  </div>

                  <div className="flower-grid" role="list">
                    {FLOWERS.map((flower) => {
                      const count = getCount(flower.id);
                      return (
                        <div
                          key={flower.id}
                          className={`flower-option ${count > 0 ? 'flower-option--selected' : ''}`}
                          role="listitem"
                        >
                          <div className="flower-option__emoji" aria-hidden="true">
                            {flower.emoji}
                          </div>
                          <div className="flower-option__name">{flower.name}</div>
                          <div className="flower-option__price">
                            ${flower.price.toFixed(2)}/stem
                          </div>
                          <div className="flower-option__controls" role="group" aria-label={`${flower.name} quantity`}>
                            <button
                              onClick={() => removeFlower(flower.id)}
                              disabled={count === 0}
                              className="qty-btn"
                              aria-label={`Remove ${flower.name}`}
                              id={`flower-remove-${flower.id}`}
                            >
                              −
                            </button>
                            <span className="qty-value" aria-live="polite">{count}</span>
                            <button
                              onClick={() => addFlower(flower.id)}
                              disabled={remaining <= 0}
                              className="qty-btn"
                              aria-label={`Add ${flower.name}`}
                              id={`flower-add-${flower.id}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="builder-nav">
                    <button onClick={() => setStep(1)} className="btn btn-ghost btn-lg" id="builder-step2-back">← Back</button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={totalFlowers === 0}
                      className="btn btn-primary btn-lg"
                      id="builder-step2-next"
                    >
                      Next: Finishing →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Finishing */}
              {step === 3 && (
                <div className="builder-section animate-slide-up">
                  <h2 className="builder-section__title">Finishing Touches</h2>

                  <div className="form-group">
                    <label className="form-label">Wrapping Style</label>
                    <div className="wrapping-options">
                      {WRAPPINGS.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setWrapping(w)}
                          className={`wrapping-option ${wrapping.id === w.id ? 'wrapping-option--active' : ''}`}
                          id={`wrapping-${w.id}`}
                          aria-pressed={wrapping.id === w.id}
                        >
                          <span aria-hidden="true">{w.emoji}</span>
                          <span>{w.label}</span>
                          <span className="wrapping-option__price">
                            {w.price === 0 ? 'Free' : `+$${w.price.toFixed(2)}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bouquet-message" className="form-label">
                      Personal Message <span className="form-label__optional">(optional)</span>
                    </label>
                    <textarea
                      id="bouquet-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="With love, from Jane 🌸"
                      className="form-input form-textarea"
                      rows={3}
                      maxLength={200}
                    />
                    <span className="char-count">{message.length}/200</span>
                  </div>

                  <div className="builder-nav">
                    <button onClick={() => setStep(2)} className="btn btn-ghost btn-lg" id="builder-step3-back">← Back</button>
                    <Link href="/shop" className="btn btn-primary btn-lg" id="builder-add-to-cart">
                      🛒 Add to Cart — ${totalPrice.toFixed(2)}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Preview ───────────────────────── */}
            <aside className="builder-preview" aria-label="Bouquet preview">
              <h2 className="builder-preview__title">Your Bouquet</h2>

              {/* Visual Preview */}
              <div className="builder-preview__visual" aria-label={`Bouquet preview with ${totalFlowers} flowers`}>
                {previewFlowers.length === 0 ? (
                  <span className="builder-preview__empty" aria-hidden="true">💐</span>
                ) : (
                  <div className="bouquet-preview-grid" aria-hidden="true">
                    {previewFlowers.map((emoji, i) => (
                      <span key={i} className="bouquet-preview-flower">{emoji}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              <dl className="builder-preview__summary">
                <div className="preview-row">
                  <dt>Size</dt>
                  <dd>{size.label} ({size.flowers} stems)</dd>
                </div>
                <div className="preview-row">
                  <dt>Flowers selected</dt>
                  <dd aria-live="polite">{totalFlowers} / {maxFlowers}</dd>
                </div>
                <div className="preview-row">
                  <dt>Wrapping</dt>
                  <dd>{wrapping.emoji} {wrapping.label}</dd>
                </div>
                {selections.map(({ flowerId, count }) => {
                  const f = FLOWERS.find((fl) => fl.id === flowerId);
                  if (!f) return null;
                  return (
                    <div key={flowerId} className="preview-row preview-row--flower">
                      <dt>{f.emoji} {f.name}</dt>
                      <dd>× {count}</dd>
                    </div>
                  );
                })}
                <div className="preview-row preview-row--total">
                  <dt>Estimated Total</dt>
                  <dd>${totalPrice.toFixed(2)}</dd>
                </div>
              </dl>

              {/* Progress Bar */}
              <div className="builder-progress" role="progressbar" aria-valuenow={totalFlowers} aria-valuemin={0} aria-valuemax={maxFlowers} aria-label="Bouquet fullness">
                <div
                  className="builder-progress__bar"
                  style={{ width: `${(totalFlowers / maxFlowers) * 100}%` }}
                />
              </div>
              <p className="builder-progress__label">
                {totalFlowers === 0
                  ? 'Start adding flowers!'
                  : totalFlowers === maxFlowers
                  ? '🎉 Bouquet complete!'
                  : `${remaining} more stem${remaining !== 1 ? 's' : ''} to fill`}
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
