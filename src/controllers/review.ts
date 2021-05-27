/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import ReviewModel, { Review } from '../models/review';
import UserModel from '../models/user';
import OrderModel from '../models/order';
import ServiceModel from '../models/service';

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

    // 이미 리뷰가 적힌 주문은 다시 리뷰를 적을 수 없다.
    if (existingOrder?.isReviewed) {
      return res.status(403).json({
        message: '리뷰가 이미 작성되었습니다',
      });
    }

    // 주문 기록의 고객과 리뷰 작성 고객이 같지 않다면 에러,
    if (String(existingOrder?.customer) !== String(existingUser?._id)) {
      return res.status(401).json({
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

    // 해당 서비스에 별점 추가
    const existingService = await ServiceModel.findById(existingOrder?.service);
    const totalReviews = await ReviewModel.find({ service: existingOrder?.service as ObjectId })
      .countDocuments();

    const newStarRating = totalReviews === 1 ? (existingService?.starRating + starRating)
      : (existingService?.starRating + starRating) / totalReviews;

    await existingService?.updateOne({ starRating: newStarRating });

    // isReviewed 업데이트
    await OrderModel.findByIdAndUpdate(orderId, { isReviewed: true });

    const review = await ReviewModel.findById(result._id)
      .populate('customer', '_id name image')
      .lean();

    return res.status(200).json({
      review: { ...review },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
