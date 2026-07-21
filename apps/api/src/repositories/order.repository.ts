import { prisma, OrderStatus } from '@flower-shop/database';

/**
 * Repository: All database operations for Order and OrderItem models.
 */
export const orderRepository = {
  /**
   * Create an order with its items and delivery in a single transaction.
   */
  create: async (data: {
    userId: string;
    totalPrice: number;
    notes?: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
    delivery: {
      address: string;
      city: string;
      scheduledAt: Date;
      notes?: string;
    };
  }) => {
    return prisma.order.create({
      data: {
        userId: data.userId,
        totalPrice: data.totalPrice,
        notes: data.notes,
        items: {
          create: data.items,
        },
        delivery: {
          create: data.delivery,
        },
      },
      include: {
        items: { include: { product: true } },
        delivery: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  /**
   * Get all orders for a specific customer.
   */
  findByUserId: (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get a single order by ID.
   */
  findById: (id: string) => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        delivery: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  },

  /**
   * Get all orders (admin view) with optional status filter.
   */
  findAll: (status?: OrderStatus) => {
    return prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: { include: { product: true } },
        delivery: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Update the status of an order.
   */
  updateStatus: (id: string, status: OrderStatus) => {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        delivery: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
