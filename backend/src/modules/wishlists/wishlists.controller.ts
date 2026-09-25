import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { WishlistsService } from './wishlists.service';

const wishlistsService = new WishlistsService();

export class WishlistsController {
  async getMyWishlists(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wishlists = await wishlistsService.getMyWishlists(req.user!.id);
      res.status(200).json({
        status: 'success',
        results: wishlists.length,
        data: { wishlists },
      });
    } catch (error) {
      next(error);
    }
  }

  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistsService.getWishlistById(req.params.id, req.user!.id);
      res.status(200).json({
        status: 'success',
        data: { wishlist },
      });
    } catch (error) {
      next(error);
    }
  }

  async createWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistsService.createWishlist(req.user!.id, req.body);
      res.status(201).json({
        status: 'success',
        data: { wishlist },
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { listingId } = req.body;
      const item = await wishlistsService.addItemToWishlist(req.params.id, req.user!.id, listingId);
      res.status(201).json({
        status: 'success',
        data: { item },
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { wishlistId, listingId } = req.params;
      await wishlistsService.removeItemFromWishlist(wishlistId, listingId, req.user!.id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await wishlistsService.deleteWishlist(req.params.id, req.user!.id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}
