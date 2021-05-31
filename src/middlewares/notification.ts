/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response, NextFunction } from 'express';
import NotificationModel from '../models/notification';
import UserModel from '../models/user';

export const notificationById = async (req: any, res: Response, next: NextFunction, notificationId: string) => {
  try {
    const notification = await NotificationModel.findById(notificationId);

    if (!notification) {
      return res.status(400).json({
        message: '알림이 존재하지 않습니다',
      });
    }

    req.notification = notification;

    return next();
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const isNotificationUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { recipient } = req.notification;
    const { email } = req.authUser;

    const user = await UserModel.findById(recipient);

    const isSame = user?.email === email;

    if (!isSame) {
      return res.status(403).json({
        message: '유저 권한이 없습니다',
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
