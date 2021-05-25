/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { orderById, isOrderUser } from '../middlewares/order';
import { isSameUser, userById } from '../middlewares/user';

import {
  getOrder, getOrders, createOrder, updateOrder, deleteOrder,
} from '../controllers/order';

const router = Router();

router.get('/orders/:orderId', auth, isOrderUser, getOrder);
router.get('/orders/:userId', auth, isSameUser, getOrders);
router.post('/orders', auth, createOrder);
router.patch('/orders/:orderId', auth, isOrderUser, updateOrder);
router.delete('/orders/:orderId', auth, isOrderUser, deleteOrder);

router.param('userId', userById);
router.param('orderId', orderById);

export default router;
