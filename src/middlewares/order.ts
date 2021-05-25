/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response, NextFunction } from 'express';
import OrderModel from '../models/order';
import UserModel from '../models/user';

export const orderById = async (req: any, res: Response, next: NextFunction, orderId: string) => {
  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(400).json({
        message: '예약이 존재하지 않습니다',
      });
    }

    req.order = order;
    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const isOrderUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const customer = await UserModel.findById(req.order.customer);
    const assistant = await UserModel.findById(req.order.assistant);

    const isSame = assistant?.email === req.authUser.email || customer?.email === req.authUser.email;

    if (!isSame) {
      return res.status(403).json({ message: '유저 권한이 없습니다' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
