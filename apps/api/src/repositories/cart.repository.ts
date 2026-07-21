import { prisma } from '@flower-shop/database';

/**
 * Repository: All database operations for Cart and CartItem models.
 */
export const cartRepository = {
  /**
   * Get or create a cart for a user.
   */
  getOrCreate: async (userId: string) => {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { product: { name: 'asc' } },
        },
      },
    });
  },

  /**
   * Find a cart item by cart ID and product ID.
   */
  findItem: (cartId: string, productId: string) => {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  },

  /**
   * Add a product to the cart or increase quantity if already exists.
   */
  addItem: (cartId: string, productId: string, quantity: number) => {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
  },

  /**
   * Update quantity of a specific cart item.
   */
  updateItemQuantity: (itemId: string, quantity: number) => {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  /**
   * Remove a single item from the cart.
   */
  removeItem: (itemId: string) => {
    return prisma.cartItem.delete({ where: { id: itemId } });
  },

  /**
   * Remove all items from a cart.
   */
  clearCart: (cartId: string) => {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  },
};
