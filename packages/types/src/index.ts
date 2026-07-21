// ─── Enums ────────────────────────────────────────────────

export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type DeliveryStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

// ─── User ─────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt: Date;
}

export interface AuthUser extends User {
  token: string;
}

// ─── Category ─────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
}

// ─── Product ──────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Cart ─────────────────────────────────────────────────

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

// ─── Order ────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  productId: string;
  product?: Product;
}

export interface Delivery {
  id: string;
  address: string;
  city: string;
  scheduledAt: Date;
  status: DeliveryStatus;
  notes?: string | null;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  notes?: string | null;
  userId: string;
  user?: User;
  items: OrderItem[];
  delivery?: Delivery | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Response ─────────────────────────────────────────

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ─── Request DTOs ─────────────────────────────────────────

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  isFeatured?: boolean;
}

export interface CreateOrderDto {
  notes?: string;
  delivery: {
    address: string;
    city: string;
    scheduledAt: string;
    notes?: string;
  };
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
