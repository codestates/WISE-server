/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-unresolved
import UserModel, { User } from '../models/user';

export const validateEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
      return res.status(409).json({
        message: '이미 회원가입 되어있는 유저입니다',
      });
    }

    return res.status(200).json({
      message: '회원 가입이 가능합니다',
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      email, name, mobile, signinMethod,
    } = req.body;

    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
      return res.status(409).json({
        message: '이미 회원가입 되어있는 유저입니다',
      });
    }

    const newUser: User = {
      email,
      name,
      mobile,
      signinMethod,
    };

    await UserModel.create(newUser);

    const user = await UserModel.findOne({ email }).lean();
    if (user) {
      user.id = user?._id;
    }

    return res.status(201).json({
      user: { ...user },
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};

export const signin = async (req: any, res: Response) => {
  try {
    const { authUser } = req;
    const { signinMethod } = req.body;

    const existingUser = await UserModel.findOne({ email: authUser.email }).lean();

    // 기존에 가입되어 있지 않은 회원이라면,
    // 새롭게 회원 가입한다.
    if (!existingUser) {
      const { name, email } = authUser;

      const newUser: User = {
        email,
        name,
        signinMethod,
      };

      await UserModel.create(newUser);

      const user = await UserModel.findOne({ email }).lean();
      if (user) {
        user.id = user?._id;
      }

      return res.status(200).json({
        user: { ...user },
      });
    }

    // DB에 존재하는 유저의 signinMethod와
    // 클라이언트로부터 받은 signinMethod가 다르다면
    // 로그인이 안된다는 메세지를 반환한다.
    if (existingUser?.signinMethod !== signinMethod) {
      return res.status(400).json({
        message: '로그인 방식이 올바르지 않습니다',
      });
    }

    if (existingUser) {
      existingUser.id = existingUser?._id;
    }

    // 새로 가입하는 경우도 아니고, signinMethod도 일치한다면, 바로 로그인 성공
    return res.status(200).json({
      user: { ...existingUser },
    });
  } catch (error) {
    return res.status(500).json({
      message: '서버 에러로 요청을 처리할 수 없습니다',
    });
  }
};
