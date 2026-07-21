'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

/** Top navigation header with cart badge and auth links */
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCartStore();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  const navLink = (href: string, label: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link href={href} className={`header__nav-link${isActive ? ' header__nav-link--active' : ''}`}>
        {label}
      </Link>
    );
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`} role="banner">
      <div className="container header__inner">

        {/* Logo */}
        <Link href="/" className="header__logo" aria-label="Blossom – go to homepage">
          <span className="header__logo-icon" aria-hidden="true">🌸</span>
          <span className="header__logo-text font-display">Blossom</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav" aria-label="Main navigation">
          {navLink('/shop', 'Shop')}
          {navLink('/bouquet-builder', 'Custom Bouquet')}
          {isAdmin && (
            <Link href="/admin/dashboard" className="header__nav-link header__nav-link--admin">
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Cart */}
          <Link href="/cart" className="header__cart-btn" aria-label={`Cart, ${itemCount} items`}>
            <CartIcon />
            {itemCount > 0 && (
              <span className="header__cart-badge" aria-hidden="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="header__user-menu">
              <button className="header__user-btn" aria-label="User menu">
                <UserIcon />
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              <div className="header__dropdown" role="menu">
                <Link href="/profile" className="header__dropdown-item" role="menuitem">My Profile</Link>
                <Link href="/orders" className="header__dropdown-item" role="menuitem">My Orders</Link>
                <hr className="header__dropdown-divider" />
                <button
                  onClick={logout}
                  className="header__dropdown-item header__dropdown-item--danger"
                  role="menuitem"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="header__auth-links">
              <Link href="/login" className="header__auth-login">Log In</Link>
              <Link href="/register" className="header__auth-register">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="header__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="header__mobile-menu animate-slide-up" role="navigation" aria-label="Mobile navigation">
          <Link href="/shop" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link href="/shop?featured=true" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Featured</Link>
          <Link href="/bouquet-builder" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Custom Bouquet</Link>
          <Link href="/cart" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {!isAuthenticated && (
            <>
              <Link href="/login" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link href="/register" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

/* ─── SVG Icons ─────────────────────────────────────────── */
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
