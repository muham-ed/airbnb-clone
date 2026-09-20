import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { BookingsService } from './bookings.service';

const bookingsService = new BookingsService();

export class BookingsController {
  async createBooking(req: AuthRequest, res: Response) {
    const booking = await bookingsService.createBooking({
      ...req.body,
      guestId: req.user!.id
    });

    res.status(201).json({
      status: 'success',
      data: booking
    });
  }

  async getMyBookings(req: AuthRequest, res: Response) {
    const bookings = await bookingsService.getMyBookings(req.user!.id);
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  }
}
