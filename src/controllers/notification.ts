/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import { Response } from 'express';
import NotificationModel, { Notification } from '../models/notification';
import UserModel from '../models/user';

export const getNotificationsByUser = async (req: any, res: Response) => {
  try {
    const { email } = req.authUser;
    const { userId } = req.query;
    const existingUser = await UserModel.findById(userId);

    if (existingUser?.email !== email) {
      return res.status(401).json({
        message: '유저 권한이 없습니다',
      });
    }

    const notifications = await NotificationModel
      .find({ recipient: existingUser?._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .lean();

    return res.status(200).json({
      notifications: [...notifications],
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const createNotification = async (req: any, res: Response) => {
  try {
    const { email } = req.authUser;
    const user = await UserModel.findOne({ email });
    const {
      recipient, subject, clientUrl, content,
    } = req.body;

    const newNotification: Notification = {
      sender: user?._id,
      recipient,
      subject,
      clientUrl,
      content,
    };

    const result = await NotificationModel.create(newNotification);

    const notification = await NotificationModel
      .findById(result?._id)
      .populate('sender', 'name')
      .lean();

    return res.status(200).json({
      notification: { ...notification },
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const updateNotification = async (req: any, res: Response) => {
  try {
    const { notification } = req;

    await NotificationModel.findByIdAndUpdate(notification._id, { isChecked: true }).exec();

    const updatedNotification = await NotificationModel
      .findById(notification._id)
      .populate('sender', 'name')
      .lean();

    return res.status(200).json({
      notification: { ...updatedNotification },
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const deleteNotification = async (req: any, res: Response) => {
  try {
    const { notification } = req;

    await NotificationModel.findByIdAndDelete(notification._id).exec();

    return res.status(200).json({
      message: '알림을 삭제했습니다',
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const deleteAllNotifications = async (req: any, res: Response) => {
  try {
    const { email } = req.authUser;
    const user = await UserModel.findOne({ email });

    await NotificationModel.deleteMany({ recipient: user?._id }).exec();

    return res.status(200).json({
      message: '모든 알림을 삭제했습니다',
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};
