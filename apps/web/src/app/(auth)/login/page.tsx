'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);
      login(data.data.token, data.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="auth-page">
        <div className="auth-card animate-scale-in">
          {/* Header */}
          <div className="auth-card__header">
            <span className="auth-card__icon" aria-hidden="true">🌸</span>
            <h1 className="auth-card__title font-display">Welcome Back</h1>
            <p className="auth-card__subtitle">Log in to your Blossom account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error" role="alert">
              <span aria-hidden="true">⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="form-input"
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg auth-form__submit"
            >
              {isLoading ? (
                <>
                  <span className="spinner-sm" aria-hidden="true" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="auth-card__footer">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="auth-link">Create one →</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
