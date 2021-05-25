/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import ReviewModel, { Review } from '../models/review';
import UserModel from '../models/user';
import OrderModel from '../models/order';

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
    const { orderId, content, starRating } = req.body;
    const { email } = req.authUser;

    const existingUser = await UserModel.findOne({ email });

    const existingOrder = await OrderModel.findById(orderId);

    // 주문 기록의 고객과 리뷰 작성 고객이 같다면,
    if (existingOrder?.customer !== existingUser?._id) {
      return res.status(403).json({
        message: '유저 권한이 없습니다',
      });
    }

    const newReview: Review = {
      customer: existingUser?._id,
      service: existingOrder?.service as ObjectId,
      content,
      starRating,
    };

    const result = await ReviewModel.create(newReview);

    console.log('result는? ', result);

    const review = await ReviewModel.findById(result._id).lean();

    console.log('review는?', review);

    // 리뷰가 된 주문 업데이트
    OrderModel.findByIdAndUpdate(orderId, { isReviewed: true });

    return res.status(200).json({
      review: { ...review },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
