'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Name must be at least 2 characters.';
    if (!form.email.includes('@')) newErrors.email = 'Please enter a valid email.';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/register', form);
      login(data.data.token, data.data.user);
      router.push('/');
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const flat: Record<string, string> = {};
        Object.keys(apiErrors).forEach((k) => { flat[k] = apiErrors[k][0]; });
        setErrors(flat);
      } else {
        setGlobalError(err.response?.data?.message ?? 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="auth-page">
        <div className="auth-card animate-scale-in">
          <div className="auth-card__header">
            <span className="auth-card__icon" aria-hidden="true">🌷</span>
            <h1 className="auth-card__title font-display">Join Blossom</h1>
            <p className="auth-card__subtitle">Create your account and start ordering</p>
          </div>

          {globalError && (
            <div className="auth-error" role="alert">
              <span aria-hidden="true">⚠️</span> {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">Full Name</label>
              <input
                id="register-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                placeholder="Jane Doe"
                required
                autoComplete="name"
                autoFocus
              />
              {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="register-email" className="form-label">Email Address</label>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="jane@example.com"
                required
                autoComplete="email"
              />
              {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="register-phone" className="form-label">
                Phone <span className="form-label__optional">(optional)</span>
              </label>
              <input
                id="register-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-input"
                placeholder="+90 555 000 0000"
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">Password</label>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error" role="alert">{errors.password}</span>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg auth-form__submit"
            >
              {isLoading ? (
                <>
                  <span className="spinner-sm" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="auth-card__footer">
            Already have an account?{' '}
            <Link href="/login" className="auth-link">Log in →</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
