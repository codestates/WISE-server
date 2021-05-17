/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';

export const userById = async (req: Request, res: Response, next: NextFunction, userId: string) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: '유저가 존재하지 않습니다',
      });
    }

    req.body.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const isSameUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isSame = req.body.user.email === req.body.authUser.email;

    if (!isSame) {
      return res.status(403).json({ message: '유저 권한이 없습니다' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
