import { Router } from 'express';
import { BookingsController } from './bookings.controller';
import { protect } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createBookingSchema } from './bookings.schema';

const router = Router();
const controller = new BookingsController();

router.use(protect);

router.post('/', validate(createBookingSchema), controller.createBooking);
router.get('/my-bookings', controller.getMyBookings);

export default router;
