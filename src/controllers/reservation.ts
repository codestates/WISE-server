/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response } from 'express';
import UserModel from '../models/user';
import ServiceModel from '../models/service';
import ReservationModel, { Reservation } from '../models/reservation';

export const getReservation = async (req: any, res: Response) => {
  try {
    const { user } = req.body;
    const existingUser = await UserModel.findById(user.id);
    let reservation;

    if (existingUser?.isAssistant) {
      reservation = await ReservationModel.findOne({ assistant: existingUser._id }).lean();
    } else {
      reservation = await ReservationModel.findOne({ customer: existingUser?._id }).lean();
    }

    return res.status(200).json({
      reservation: { ...reservation },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const createReservation = async (req: any, res: Response) => {
  try {
    const { email } = req.authUser;
    const customer = await UserModel.findOne({ email });
    const {
      state, serviceId, home, hospital, content, date, time, hours, totalPayment,
    } = req.body;
    const assistant = await ServiceModel.findById(serviceId);

    const newReservation: Reservation = {
      customer: customer?._id,
      assistant: assistant?.assistant,
      service: serviceId,
      home,
      hospital,
      content,
      date,
      time,
      hours,
      totalPayment,
      state,
    };

    const result = await ReservationModel.create(newReservation);

    const reservation = await ReservationModel.findById(result._id).lean();

    return res.status(200).json({
      reservation: { ...reservation },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const updateReservation = async (req: any, res: Response) => {
  try {
    let reservationDetails = {};
    const { state } = req.body;

    if (state) {
      reservationDetails = { ...reservationDetails, state };
    }

    const { reservation } = req;
    await ReservationModel.findByIdAndUpdate(reservation._id, reservationDetails).exec();

    const updatedReservation = await ReservationModel.findById(reservation._id).lean();

    return res.status(200).json({
      reservation: { ...updatedReservation },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const deleteReservation = async (req: any, res: Response) => {
  try {
    const { reservation } = req;
    await ReservationModel.findById(reservation._id).exec();

    ReservationModel.findByIdAndDelete(reservation._id).exec();

    return res.status(200).json({ message: '예약 정보를 삭제했습니다' });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
