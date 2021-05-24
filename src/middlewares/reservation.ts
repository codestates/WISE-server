/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response, NextFunction } from 'express';
import ReservationModel from '../models/reservation';
import UserModel from '../models/user';

export const reservationById = async (req: any, res: Response, next: NextFunction, reservationId: string) => {
  try {
    const reservation = await ReservationModel.findById(reservationId);

    if (!reservation) {
      return res.status(400).json({
        message: '예약이 존재하지 않습니다',
      });
    }

    req.reservation = reservation;
    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const isSameAssistant = async (req: any, res: Response, next: NextFunction) => {
  try {
    const assistant = await UserModel.findById(req.reservation.assistant);
    const isSame = assistant?.email === req.authUser.email;
    if (!isSame) {
      return res.status(403).json({ message: '어시스턴트 권한이 없습니다' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
