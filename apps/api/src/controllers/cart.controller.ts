import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { ApiResponseBuilder } from '../utils/ApiResponse';

/**
 * Controller: Handles HTTP requests for cart endpoints.
 */
export const cartController = {
  getCart: async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user!.userId);
    res.json(ApiResponseBuilder.success('Cart fetched.', cart));
  },

  addItem: async (req: Request, res: Response) => {
    const { productId, quantity = 1 } = req.body;
    const cart = await cartService.addItem(req.user!.userId, productId, quantity);
    res.status(201).json(ApiResponseBuilder.success('Item added to cart.', cart));
  },

  updateItem: async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const cart = await cartService.updateItem(req.user!.userId, req.params.itemId, quantity);
    res.json(ApiResponseBuilder.success('Cart item updated.', cart));
  },

  removeItem: async (req: Request, res: Response) => {
    const cart = await cartService.removeItem(req.user!.userId, req.params.itemId);
    res.json(ApiResponseBuilder.success('Item removed from cart.', cart));
  },

  clearCart: async (req: Request, res: Response) => {
    const cart = await cartService.clearCart(req.user!.userId);
    res.json(ApiResponseBuilder.success('Cart cleared.', cart));
  },
};
