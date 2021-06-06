/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
import { Response, NextFunction } from 'express';
import admin from '../firebase';

const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.header('accessToken');
    if (!accessToken) {
      return res.status(400).json({ message: '로그인을 해주세요' });
    }

    admin.auth().verifyIdToken(accessToken as string).then((authenticatedUser) => {
      req.authUser = authenticatedUser;
      return next();
    }).catch(() => res.status(400).json({
      message: '로그인을 다시 해주세요',
    }));
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export default auth;
