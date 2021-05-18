/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response, NextFunction } from 'express';
import ServiceModel from '../models/service';
import UserModel from '../models/user';

export const serviceById = async (req: any, res: Response, next: NextFunction, serviceId: string) => {
  try {
    const service = await ServiceModel.findById(serviceId);

    if (!service) {
      return res.status(400).json({
        message: '어시스턴트가 존재하지 않습니다',
      });
    }

    req.service = service;
    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const isSameAssistant = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.service.assistant);
    const isSame = user?.email === req.authUser.email;
    if (!isSame) {
      return res.status(403).json({ message: '어시스턴트 권한이 없습니다' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
