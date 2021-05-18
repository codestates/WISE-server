/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import ReviewModel, { Review } from '../models/review';
import UserModel from '../models/user';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { serviceId, page } = req.query;
    const reviewsPerPage = 6;
    const totalReviews = await ReviewModel.find({ service: serviceId as any }).countDocuments();

    const reviews = await ReviewModel.find({ service: serviceId as any })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * reviewsPerPage)
      .limit(reviewsPerPage)
      .populate('customer', '_id name image')
      .lean();

    console.log(reviews);
    console.log(totalReviews);

    return res.status(200).json({
      reviews: [...reviews],
      totalReviews,
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const createReview = async (req: any, res: Response) => {
  try {
    const { serviceId, content } = req.body;
    const { email } = req.authUser;

    const existingUser = await UserModel.findOne({ email });

    const newReview: Review = {
      content,
      service: serviceId,
      customer: existingUser?._id,
    };

    const result = await ReviewModel.create(newReview);

    console.log('result는? ', result);

    const review = await ReviewModel.findById(result._id).lean();

    console.log('review는?', review);

    return res.status(200).json({
      review: { ...review },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
