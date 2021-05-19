/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { reservationById, isSameAssistant } from '../middlewares/reservation';
import { isSameUser, userById } from '../middlewares/user';

import {
  getReservation, createReservation, updateReservation, deleteReservation,
} from '../controllers/reservation';

const router = Router();

router.get('/reservations/:userId', auth, isSameUser, getReservation);
router.post('/reservations', auth, createReservation);
router.patch('/reservations/:reservationId', auth, isSameAssistant, updateReservation);
router.delete('/reservations/:reservationId', auth, isSameAssistant, deleteReservation);

router.param('userId', userById);
router.param('reservationId', reservationById);

export default router;
