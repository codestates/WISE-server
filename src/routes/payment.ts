/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { orderById } from '../middlewares/order';
import { completePayment } from '../controllers/payment';

const router = Router();

router.post('/payments/:orderId', auth, completePayment);

router.param('orderId', orderById);

export default router;
