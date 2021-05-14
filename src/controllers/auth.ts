import { Request, Response } from 'express';
// eslint-disable-next-line import/no-unresolved
import UserModel, { User } from '../models/user';

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      email, name, role, mobile,
    } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: '이미 회원가입 되어있는 유저입니다',
      });
    }

    const newUser: User = {
      email,
      name,
      mobile,
      role,
    };

    await UserModel.create(newUser);

    const user = await UserModel.findOne({ email }).lean();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
