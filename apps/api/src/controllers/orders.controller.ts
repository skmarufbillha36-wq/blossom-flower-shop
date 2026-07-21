import { Request, Response } from 'express';
import { orderService } from '../services/orders.service';
import { ApiResponseBuilder } from '../utils/ApiResponse';
import { OrderStatus } from '@flower-shop/database';

/**
 * Controller: Handles HTTP requests for order endpoints.
 */
export const ordersController = {
  placeOrder: async (req: Request, res: Response) => {
    const order = await orderService.placeOrder(req.user!.userId, req.body);
    res.status(201).json(ApiResponseBuilder.success('Order placed successfully.', order));
  },

  getMyOrders: async (req: Request, res: Response) => {
    const orders = await orderService.getMyOrders(req.user!.userId);
    res.json(ApiResponseBuilder.success('Orders fetched.', orders));
  },

  getOrderById: async (req: Request, res: Response) => {
    const isAdmin = req.user!.role === 'ADMIN';
    const order = await orderService.getOrderById(req.params.id, req.user!.userId, isAdmin);
    res.json(ApiResponseBuilder.success('Order fetched.', order));
  },

  // ─── Admin ─────────────────────────────────────────────

  getAllOrders: async (req: Request, res: Response) => {
    const orders = await orderService.getAllOrders(req.query.status as string | undefined);
    res.json(ApiResponseBuilder.success('All orders fetched.', orders));
  },

  updateStatus: async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await orderService.updateStatus(req.params.id, status as OrderStatus);
    res.json(ApiResponseBuilder.success('Order status updated.', order));
  },
};
