/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import UserModel from '../models/user';
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

    return res.status(200).json({
      message: '유저 정보를 삭제했습니다',
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};
