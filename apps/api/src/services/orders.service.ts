import { CreateOrderDto } from '@flower-shop/types';
import { OrderStatus } from '@flower-shop/database';
import { orderRepository } from '../repositories/order.repository';
import { cartRepository } from '../repositories/cart.repository';
import { cartService } from './cart.service';
import { ApiError } from '../utils/ApiError';

/**
 * Service: Order business logic.
 */
export const orderService = {
  /**
   * Place an order from the user's current cart.
   * - Validates cart is not empty
   * - Creates order, items, and delivery in one DB transaction
   * - Clears the cart after successful order
   */
  placeOrder: async (userId: string, dto: CreateOrderDto) => {
    const cart = await cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new ApiError(400, 'Your cart is empty. Add items before placing an order.');
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(item.product.price),
    }));

    const order = await orderRepository.create({
      userId,
      totalPrice: cart.totalPrice,
      notes: dto.notes,
      items,
      delivery: {
        address: dto.delivery.address,
        city: dto.delivery.city,
        scheduledAt: new Date(dto.delivery.scheduledAt),
        notes: dto.delivery.notes,
      },
    });

    // Clear cart after successful order
    await cartRepository.clearCart(cart.id);

    return order;
  },

  /**
   * Get all orders for a specific customer.
   */
  getMyOrders: (userId: string) => {
    return orderRepository.findByUserId(userId);
  },

  /**
   * Get a single order by ID.
   * Ensures the order belongs to the requesting user (unless admin).
   */
  getOrderById: async (orderId: string, userId: string, isAdmin: boolean) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found.');
    }

    // Non-admins can only view their own orders
    if (!isAdmin && order.userId !== userId) {
      throw new ApiError(403, 'You do not have permission to view this order.');
    }

    return order;
  },

  /**
   * Get all orders (admin only).
   */
  getAllOrders: (status?: string) => {
    return orderRepository.findAll(status as OrderStatus | undefined);
  },

  /**
   * Update an order's status (admin only).
   */
  updateStatus: async (orderId: string, status: OrderStatus) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found.');
    }
    return orderRepository.updateStatus(orderId, status);
  },
};
