/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response } from 'express';
import moment from 'moment';
import { ObjectId } from 'mongoose';
import UserModel from '../models/user';
import ServiceModel, { Service } from '../models/service';
import { deleteImage } from '../utils/s3';
import ReservationModel from '../models/reservation';

export const getService = async (req: any, res: Response) => {
  try {
    const { service } = req;
    const existingService = await ServiceModel.findById(service._id).lean();

    return res.status(200).json({
      service: { ...existingService },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const createService = async (req: any, res: Response) => {
  try {
    const { email } = req.authUser;
    const {
      description, wage, availableDays, greetings, isDriver, location, isTrained, isAuthorized, bankAccount,
    } = req.body;

    const images: any = [...req.files.images as any];
    const imagesArray: string[] = [];
    images.forEach((element: any) => {
      imagesArray.push(element.key);
    });

    const trainingCert: any = [...req.files.trainingCert as any];
    const trainingCertArray: string[] = [];
    trainingCert.forEach((element: any) => {
      trainingCertArray.push(element.key);
    });

    const orgAuth: any = [...req.files.orgAuth as any];
    const orgAuthArray: string[] = [];
    orgAuth.forEach((element: any) => {
      orgAuthArray.push(element.key);
    });

    const existingUser = await UserModel.findOne({ email });

    const newService: Service = {
      assistant: existingUser?._id,
      description,
      wage,
      availableDays,
      greetings,
      isDriver,
      location,
      images: imagesArray,
      isTrained,
      trainingCert: trainingCertArray,
      isAuthorized,
      orgAuth: orgAuthArray,
      starRating: 0,
      bankAccount,
    };

    await ServiceModel.create(newService);
    const existingService = await ServiceModel.findOne({ assistant: existingUser?._id }).lean();

    await UserModel.findByIdAndUpdate(existingUser?._id, { isAssistant: true }).exec();

    return res.status(200).json({
      service: { ...existingService },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const updateService = async (req: any, res: Response) => {
  try {
    const images: any = [...req.files.images as any];
    const imagesArray: string[] = [];
    images.forEach((element: any) => {
      imagesArray.push(element.key);
    });

    const trainingCert: any = [...req.files.trainingCert as any];
    const trainingCertArray: string[] = [];
    trainingCert.forEach((element: any) => {
      trainingCertArray.push(element.key);
    });

    const orgAuth: any = [...req.files.orgAuth as any];
    const orgAuthArray: string[] = [];
    orgAuth.forEach((element: any) => {
      orgAuthArray.push(element.key);
    });

    let serviceDetails = {};
    const {
      description, wage, availableDays, greetings, isDriver, location, isTrained, isAuthorized, bankAccount,
    } = req.body;

    if (description) {
      serviceDetails = { ...serviceDetails, description };
    }
    if (wage) {
      serviceDetails = { ...serviceDetails, wage };
    }
    if (availableDays) {
      serviceDetails = { ...serviceDetails, availableDays };
    }
    if (greetings) {
      serviceDetails = { ...serviceDetails, greetings };
    }
    if (isDriver) {
      serviceDetails = { ...serviceDetails, isDriver };
    }
    if (location) {
      serviceDetails = { ...serviceDetails, location };
    }
    if (wage) {
      serviceDetails = { ...serviceDetails, wage };
    }
    if (isTrained) {
      serviceDetails = { ...serviceDetails, isTrained };
    }
    if (trainingCert) {
      serviceDetails = { ...serviceDetails, trainingCert: trainingCertArray };
    }
    if (isAuthorized) {
      serviceDetails = { ...serviceDetails, isAuthorized };
    }
    if (orgAuth) {
      serviceDetails = { ...serviceDetails, orgAuth: orgAuthArray };
    }
    if (images) {
      serviceDetails = { ...serviceDetails, images: imagesArray };
    }
    if (bankAccount) {
      serviceDetails = { ...serviceDetails, bankAccount };
    }

    const { service } = req;
    const existingService = await ServiceModel.findByIdAndUpdate(service._id, serviceDetails).lean();

    existingService?.images.forEach((element: any) => {
      deleteImage(element.split('/')[1]);
    });
    existingService?.trainingCert.forEach((element: any) => {
      deleteImage(element.split('/')[1]);
    });
    existingService?.orgAuth.forEach((element: any) => {
      deleteImage(element.split('/')[1]);
    });

    const updatedService = await ServiceModel.findById(service._id).lean();

    return res.status(200).json({
      service: { ...updatedService },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const deleteService = async (req: any, res: Response) => {
  try {
    const { service } = req;
    const existingService = await ServiceModel.findById(service._id).lean();

    existingService?.images.forEach((element: any) => {
      deleteImage(element.split('/')[1]);
    });
    existingService?.trainingCert.forEach((element: any) => {
      deleteImage(element.split('/')[1]);
    });
    existingService?.orgAuth.forEach((element: any) => {
      deleteImage(element.split('/')[1]);
    });

    ServiceModel.findByIdAndDelete(service._id).exec();
    await UserModel.findByIdAndUpdate(existingService?.assistant, { isAssistant: false }).exec();

    return res.status(200).json({ message: '서비스 정보를 삭제했습니다' });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const getAllServices = async (req: any, res: Response) => {
  try {
    const popularService = await ServiceModel.find({})
      .sort({ starRating: -1 })
      .limit(8)
      .select('assistant images wage greetings location starRating')
      .populate('assistant', 'name')
      .lean();

    const { page } = req.query;
    const searchPerPage = 16;

    const service = await ServiceModel.find({})
      .sort({ starRating: -1 })
      .skip(8 + (Number(page) - 1) * searchPerPage)
      .limit(searchPerPage)
      .select('assistant images wage greetings location starRating')
      .populate('assistant', 'name')
      .lean();

    return res.status(200).json({
      service: [...service],
      popularService: [...popularService],
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const getServices = async (req: any, res: Response) => {
  try {
    const {
      location, startDate, endDate, time,
    } = req.query;
    const reservation = await ReservationModel.find({
      date: {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate(),
      },
      time,
      state: { $in: ['accept', 'complete'] },
    }).select('assistant');

    const newReservation:ObjectId[] = [];
    reservation.forEach((element: any) => {
      newReservation.push(element.assistant);
    });

    const Days = [];

    let i = 0;
    while (moment(startDate).add(i - 1, 'days').format('YYYY-MM-DD') !== moment(endDate).format('YYYY-MM-DD')) {
      Days.push(`${moment(startDate).add(i, 'days').format('dddd')} ${time}`);
      i += 1;
      if (i === 7) break;
    }

    const { page } = req.query;
    const searchPerPage = 16;

    const service = await ServiceModel.find({
      assistant: { $nin: newReservation }, location, availableDays: { $in: Days },
    })
      .sort({ starRating: -1 })
      .skip((Number(page) - 1) * searchPerPage)
      .limit(searchPerPage)
      .select('assistant images wage greetings location starRating')
      .populate('assistant', 'name')
      .lean();

    return res.status(200).json({
      service: [...service],
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
