/* eslint-disable import/no-unresolved */
import { Request, Response, NextFunction } from 'express';
import admin from '../firebase';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.header('accessToken');

    const authenticatedUser = await admin.auth().verifyIdToken(accessToken as string);

    req.body.email = authenticatedUser.email;

    return next();
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export default auth;
