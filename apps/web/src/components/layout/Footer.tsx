import Link from 'next/link';

/** Site-wide footer with navigation and brand info */
export const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span aria-hidden="true">🌸</span>
            <span className="font-display">Blossom</span>
          </div>
          <p className="footer__tagline">
            Handcrafted floral arrangements for every occasion. Bringing beauty to your doorstep.
          </p>
          <div className="footer__socials">
            <a
              href="https://www.instagram.com/abdelkarem_ahmed1?igsh=ZDhqODZ4N2Qwd2ww"
              aria-label="Instagram"
              className="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/share/1EvWSUrKXh/"
              aria-label="Facebook"
              className="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav className="footer__nav" aria-label="Footer navigation">
          <div className="footer__nav-group">
            <h3 className="footer__nav-title">Shop</h3>
            <Link href="/shop" className="footer__nav-link">All Flowers</Link>
            <Link href="/shop?featured=true" className="footer__nav-link">Featured</Link>
            <Link href="/bouquet-builder" className="footer__nav-link">Custom Bouquet</Link>
          </div>
          <div className="footer__nav-group">
            <h3 className="footer__nav-title">Account</h3>
            <Link href="/login" className="footer__nav-link">Log In</Link>
            <Link href="/register" className="footer__nav-link">Sign Up</Link>
            <Link href="/orders" className="footer__nav-link">My Orders</Link>
          </div>
          <div className="footer__nav-group">
            <h3 className="footer__nav-title">Info</h3>
            <Link href="/about" className="footer__nav-link">About Us</Link>
            <Link href="/contact" className="footer__nav-link">Contact</Link>
            <Link href="/delivery" className="footer__nav-link">Delivery Info</Link>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Blossom Flower Shop. All rights reserved.
          </p>
          <p className="footer__credit">
            Built with ❤️ — Ostim Technical University, 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ─── SVG Icons ─────────────────────────────────────────── */
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
