import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';

/**
 * Service: Shopping cart business logic.
 */
export const cartService = {
  /**
   * Get the current user's cart (creates one if none exists).
   * Calculates and attaches total price.
   */
  getCart: async (userId: string) => {
    const cart = await cartRepository.getOrCreate(userId);

    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return { ...cart, totalPrice };
  },

  /**
   * Add a product to the user's cart.
   * Validates product exists and has sufficient stock.
   */
  addItem: async (userId: string, productId: string, quantity: number) => {
    // Validate product exists and has stock
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found.');
    }
    if (!product.isAvailable) {
      throw new ApiError(400, 'This product is currently unavailable.');
    }
    if (product.stock < quantity) {
      throw new ApiError(400, `Only ${product.stock} units available in stock.`);
    }

    const cart = await cartRepository.getOrCreate(userId);
    await cartRepository.addItem(cart.id, productId, quantity);

    return cartService.getCart(userId);
  },

  /**
   * Update the quantity of a cart item.
   */
  updateItem: async (userId: string, itemId: string, quantity: number) => {
    if (quantity < 1) {
      throw new ApiError(400, 'Quantity must be at least 1.');
    }

    await cartRepository.updateItemQuantity(itemId, quantity);
    return cartService.getCart(userId);
  },

  /**
   * Remove a single item from the cart.
   */
  removeItem: async (userId: string, itemId: string) => {
    await cartRepository.removeItem(itemId);
    return cartService.getCart(userId);
  },

  /**
   * Clear all items from the user's cart.
   */
  clearCart: async (userId: string) => {
    const cart = await cartRepository.getOrCreate(userId);
    await cartRepository.clearCart(cart.id);
    return cartService.getCart(userId);
  },
};
