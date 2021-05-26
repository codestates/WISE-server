/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import UserModel from '../models/user';
import ServiceModel from '../models/service';
import OrderModel from '../models/order';
import ReviewModel from '../models/review';
import { deleteImage } from '../utils/s3';

export const getUser = async (req: any, res: Response) => {
  try {
    const { user } = req;
    const existingUser = await UserModel.findById(user.id).lean();

    return res.status(200).json({
      user: { ...existingUser },
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const image: any = { ...req.file };
    let userDetails = {};

    const { name, mobile } = req.body;

    if (name) {
      userDetails = { ...userDetails, name };
    }
    if (mobile) {
      userDetails = { ...userDetails, mobile };
    }
    if (image.key) {
      userDetails = { ...userDetails, image: image.key };
    }

    const existingUser = await UserModel.findByIdAndUpdate(req.params.userId, userDetails).lean();

    if (existingUser?.image) {
      const prevImage = existingUser.image.split('/')[1] || '';
      deleteImage(prevImage);
    }

    const user = await UserModel.findById(req.params.userId).lean();

    return res.status(200).json({
      user: { ...user },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { user } = req;
    const existingUser = await UserModel.findByIdAndDelete(user.id).exec();

    if (existingUser?.image) {
      const prevImage = existingUser.image.split('/')[1] || '';
      deleteImage(prevImage);
    }

    if (existingUser?.isAssistant) {
      const existingService = await ServiceModel.findOne({ assistant: user.id }).lean();

      existingService?.images.forEach((element: any) => {
        deleteImage(element.split('/')[1]);
      });
      existingService?.trainingCert.forEach((element: any) => {
        deleteImage(element.split('/')[1]);
      });
      existingService?.orgAuth.forEach((element: any) => {
        deleteImage(element.split('/')[1]);
      });

      ReviewModel.remove({ service: existingService?._id }).exec();
      await OrderModel.updateMany({ service: existingService?._id }, { assistant: null, service: null });
      ServiceModel.findByIdAndDelete(existingService?._id).exec();
    }

    return res.status(200).json({
      message: '유저 정보를 삭제했습니다',
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};
