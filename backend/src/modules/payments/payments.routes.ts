import express, { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new PaymentsController();

router.post('/create-checkout-session', protect, controller.createCheckoutSession);

// الـ Webhook يجب أن يستخدم raw body وليس json
router.post('/webhook', express.raw({ type: 'application/json' }), controller.webhook);

export default router;
