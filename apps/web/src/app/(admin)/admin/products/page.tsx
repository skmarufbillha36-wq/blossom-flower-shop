'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { Product, Category } from '@flower-shop/types';
import api from '@/lib/api';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: '', description: '', price: '', stock: '',
  categoryId: '', imageUrl: '', isFeatured: false, isAvailable: true,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { router.push('/'); return; }
    loadData();
  }, [isAuthenticated, isAdmin, router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products?limit=50'),
        api.get('/categories'),
      ]);
      setProducts(productsRes.data.data ?? []);
      setCategories(categoriesRes.data.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
      imageUrl: (product as any).imageUrl ?? '',
      isFeatured: product.isFeatured,
      isAvailable: product.isAvailable,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoryId: form.categoryId,
      imageUrl: form.imageUrl || undefined,
      isFeatured: form.isFeatured,
      isAvailable: form.isAvailable,
    };

    try {
      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct.id}`, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.data.data : p))
        );
      } else {
        const res = await api.post('/products', payload);
        setProducts((prev) => [res.data.data, ...prev]);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This will mark it as unavailable.`)) return;
    await api.delete(`/products/${product.id}`);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, imageUrl: res.data.data.imageUrl }));
    } catch {
      setError('Image upload failed. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="admin-page">
        <div className="container">
          <div className="admin-header">
            <h1 className="page-title font-display">Products</h1>
            <button
              onClick={openCreateModal}
              className="btn btn-primary"
              id="admin-create-product-btn"
            >
              + Add Product
            </button>
          </div>

          {isLoading ? (
            <p>Loading products...</p>
          ) : (
            <div className="admin-section">
              <div className="table-wrapper" role="region" aria-label="Products table" tabIndex={0}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Category</th>
                      <th scope="col">Price</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-table__product-name">
                            <span className="font-medium text-gray-800">{product.name}</span>
                            {product.isFeatured && (
                              <Badge variant="brand">Featured</Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-gray-500">
                          {(product as any).category?.name ?? '—'}
                        </td>
                        <td className="font-semibold">
                          ${Number(product.price).toFixed(2)}
                        </td>
                        <td>
                          <span className={product.stock <= 5 ? 'text-amber-600 font-semibold' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <Badge variant={product.isAvailable ? 'success' : 'danger'}>
                            {product.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <button
                              onClick={() => openEditModal(product)}
                              className="btn btn-ghost btn-sm"
                              id={`edit-product-${product.id}`}
                              aria-label={`Edit ${product.name}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="btn btn-danger btn-sm"
                              id={`delete-product-${product.id}`}
                              aria-label={`Delete ${product.name}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-card animate-scale-in">
            <div className="modal-header">
              <h2 id="product-modal-title" className="modal-title font-display">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
                aria-label="Close modal"
                id="close-product-modal"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="auth-error" role="alert">{error}</div>
            )}

            <form onSubmit={handleSave} className="modal-form" noValidate>
              <div className="form-group">
                <label htmlFor="product-form-name" className="form-label">Product Name *</label>
                <input
                  id="product-form-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-form-desc" className="form-label">Description *</label>
                <textarea
                  id="product-form-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-input form-textarea"
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div className="image-upload-area">
                  {form.imageUrl ? (
                    <div className="image-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imageUrl} alt="Product preview" className="image-preview__img" />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, imageUrl: '' }))}
                        className="image-preview__remove"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="product-image-upload" className="image-upload-btn">
                      {isUploadingImage ? (
                        <><span className="spinner-sm" aria-hidden="true" /> Uploading...</>
                      ) : (
                        <>
                          <span className="image-upload-btn__icon">📷</span>
                          <span>Click to upload image</span>
                          <span className="image-upload-btn__hint">JPEG, PNG, WebP — max 5MB</span>
                        </>
                      )}
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        className="sr-only"
                        disabled={isUploadingImage}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="modal-form__row">
                <div className="form-group">
                  <label htmlFor="product-form-price" className="form-label">Price ($) *</label>
                  <input
                    id="product-form-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="product-form-stock" className="form-label">Stock *</label>
                  <input
                    id="product-form-stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="product-form-category" className="form-label">Category *</label>
                <select
                  id="product-form-category"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="modal-form__checkboxes">
                <label className="checkbox-label">
                  <input
                    id="product-form-featured"
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="checkbox-input"
                  />
                  <span>Mark as Featured</span>
                </label>
                <label className="checkbox-label">
                  <input
                    id="product-form-available"
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="checkbox-input"
                  />
                  <span>Available for Purchase</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                  id="cancel-product-modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  id="save-product-btn"
                >
                  {isSaving ? (
                    <><span className="spinner-sm" aria-hidden="true" /> Saving...</>
                  ) : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
