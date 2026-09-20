import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';

const paymentsService = new PaymentsService();

export class PaymentsController {
  async createCheckoutSession(req: Request, res: Response) {
    const { bookingId } = req.body;
    const url = await paymentsService.createCheckoutSession(bookingId);

    res.status(200).json({
      status: 'success',
      data: { url },
    });
  }

  async webhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const result = await paymentsService.handleWebhook(sig, req.body);

    res.status(200).send(result);
  }
}
