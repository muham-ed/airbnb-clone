import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { ListingsService } from './listings.service';

const listingsService = new ListingsService();

export class ListingsController {
  async getAllListings(req: AuthRequest, res: Response) {
    const listings = await listingsService.getAllListings(req.query);
    res.status(200).json({ status: 'success', results: listings.length, data: listings });
  }

  async getListing(req: AuthRequest, res: Response) {
    const listing = await listingsService.getListingById(req.params.id);
    res.status(200).json({ status: 'success', data: listing });
  }

  async createListing(req: AuthRequest, res: Response) {
    const listing = await listingsService.createListing(req.body, req.user!.id);
    res.status(201).json({ status: 'success', data: listing });
  }

  async updateListing(req: AuthRequest, res: Response) {
    const listing = await listingsService.updateListing(req.params.id, req.body, req.user!.id);
    res.status(200).json({ status: 'success', data: listing });
  }

  async deleteListing(req: AuthRequest, res: Response) {
    await listingsService.deleteListing(req.params.id, req.user!.id);
    res.status(204).json({ status: 'success', data: null });
  }
}
