/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { notificationById, isNotificationUser } from '../middlewares/notification';
import {
  getNotificationsByUser, createNotification, updateNotification,
  deleteNotification, deleteAllNotifications,
} from '../controllers/notification';

const router = Router();

router.get('/notifications', auth, getNotificationsByUser);
router.post('/notifications', auth, createNotification);
router.patch('/notifications/:notificationId', auth, isNotificationUser, updateNotification);
router.delete('/notifications/:notificationId', auth, isNotificationUser, deleteNotification);
router.delete('/notifications/all', auth, deleteAllNotifications);

router.param('notificationId', notificationById);

export default router;
