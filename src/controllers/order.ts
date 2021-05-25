/* eslint-disable no-throw-literal */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response } from 'express';

import dotenv from 'dotenv';
import { ObjectId } from 'mongoose';
import UserModel from '../models/user';
import ServiceModel from '../models/service';
import OrderModel, { Order } from '../models/order';

dotenv.config();

export const getOrder = async (req: any, res: Response) => {
  try {
    const { order } = req;
    const existingOrder = await OrderModel.findById(order._id).lean();

    return res.status(200).json({
      order: { ...existingOrder },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    const { user } = req;
    const existingUser = await UserModel.findById(user.id);

    let orders;

    if (existingUser?.isAssistant) {
      orders = await OrderModel.findOne({ assistant: existingUser._id }).lean();
    } else {
      orders = await OrderModel.findOne({ customer: existingUser?._id }).lean();
    }

    return res.status(200).json({
      orders: { ...orders },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const createOrder = async (req: any, res: Response) => {
  try {
    const { email } = req.authUser;
    const {
      message, serviceId, pickup, hospital, content, date, time, hours, totalPayment,
    } = req.body;
    const customer = await UserModel.findOne({ email });
    const service = await ServiceModel.findById(serviceId);

    const newOrder: Order = {
      customer: customer?._id,
      assistant: service?.assistant as ObjectId,
      service: serviceId,
      pickup,
      hospital,
      content,
      message,
      date,
      time,
      hours,
      totalPayment,
      state: 'apply',
      isReviewed: false,
    };

    const result = await OrderModel.create(newOrder);

    const order = await OrderModel.findById(result._id).lean();

    return res.status(200).json({
      order: { ...order },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const updateOrder = async (req: any, res: Response) => {
  try {
    let orderDetails = {};
    const { state } = req.body;

    if (state) {
      orderDetails = { ...orderDetails, state };
    }

    const { order } = req;
    await OrderModel.findByIdAndUpdate(order._id, orderDetails).exec();

    const updatedOrder = await OrderModel.findById(order._id).lean();

    return res.status(200).json({
      order: { ...updatedOrder },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const deleteOrder = async (req: any, res: Response) => {
  try {
    const { order } = req;
    await OrderModel.findById(order._id).exec();

    OrderModel.findByIdAndDelete(order._id).exec();

    return res.status(200).json({ message: '신청이 취소되었습니다' });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
