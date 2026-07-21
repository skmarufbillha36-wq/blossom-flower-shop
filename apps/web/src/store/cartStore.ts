import { create } from 'zustand';
import { Cart, CartItem } from '@flower-shop/types';
import api from '@/lib/api';

interface CartState {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

/**
 * Global cart state store.
 * Syncs with the backend API on every mutation.
 */
export const useCartStore = create<CartState>((set) => ({
  cart: null,
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/cart');
      const cart: Cart = data.data;
      set({
        cart,
        itemCount: cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/items', { productId, quantity });
    const cart: Cart = data.data;
    set({
      cart,
      itemCount: cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    });
  },

  updateItem: async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    const cart: Cart = data.data;
    set({
      cart,
      itemCount: cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    });
  },

  removeItem: async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    const cart: Cart = data.data;
    set({
      cart,
      itemCount: cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    });
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ cart: null, itemCount: 0 });
  },
}));
