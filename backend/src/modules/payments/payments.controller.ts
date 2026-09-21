import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

const paymentsService = new PaymentsService();

export class PaymentsController {
  async createCheckoutSession(req: AuthRequest, res: Response) {
    const { bookingId } = req.body;
    // تم استخدام req.user.id بشكل آمن عبر AuthRequest
    const url = await paymentsService.createCheckoutSession(bookingId, req.user!.id);

    res.status(200).json({
      status: 'success',
      data: { url },
    });
  }

  async webhook(req: AuthRequest, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const result = await paymentsService.handleWebhook(sig, req.body);

    res.status(200).send(result);
  }
}
