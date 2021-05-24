/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { reservationById } from '../middlewares/reservation';
import { completePayment } from '../controllers/payment';

const router = Router();

router.post('/payments/:reservationId', auth, completePayment);

router.param('reservationId', reservationById);

export default router;
