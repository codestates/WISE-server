/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response } from 'express';
import moment from 'moment';
import { ObjectId } from 'mongoose';
import UserModel from '../models/user';
import ServiceModel from '../models/service';
import OrderModel from '../models/order';
import ReviewModel from '../models/review';
import { deleteImage } from '../utils/s3';

export const getService = async (req: any, res: Response) => {
  try {
    const { service } = req;
    const existingService = await ServiceModel.findById(service._id).populate('assistant', 'name').lean();

    return res.status(200).json({
      service: { ...existingService },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const getServices = async (req: any, res: Response) => {
  try {
    const {
      location, date, time, page,
    } = req.query;
    const searchPerPage = 16;

    const orders = await OrderModel.find({
      date: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate(),
      },
      time,
      state: { $in: ['accept', 'complete'] },
    }).select('assistant');

    const bookedOrders: ObjectId[] = [];
    orders.forEach((element: any) => {
      bookedOrders.push(element.assistant);
    });
    const day = `${moment(date).format('dddd')} ${time}`;

    const services = await ServiceModel.find({
      assistant: { $nin: bookedOrders }, location, availableDays: day,
    })
      .sort({ _id: 1, starRating: -1 })
      .skip((Number(page) - 1) * searchPerPage)
      .limit(searchPerPage)
      .select('assistant images wage greetings location starRating')
      .populate('assistant', 'name')
      .lean();

    const totalServices = await ServiceModel.find({
      assistant: { $nin: bookedOrders }, location, availableDays: day,
    }).countDocuments();

    return res.status(200).json({
      services: [...services],
      totalServices,
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const getPopularServices = async (req: any, res: Response) => {
  try {
    const popularServices = await ServiceModel.find({})
      .sort({ _id: 1, starRating: -1 })
      .limit(8)
      .select('assistant images wage greetings location starRating')
      .populate('assistant', 'name')
      .lean();

    return res.status(200).json({
      popularServices: [...popularServices],
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

export const getAllServices = async (req: any, res: Response) => {
  try {
    const { page } = req.query;
    const searchPerPage = 16;

    const services = await ServiceModel.find({})
      .sort({ _id: 1, starRating: -1 })
      .skip(8 + (Number(page) - 1) * searchPerPage)
      .limit(searchPerPage)
      .select('assistant images wage greetings location starRating')
      .populate('assistant', 'name')
      .lean();

    const totalServices = await ServiceModel.find({}).countDocuments();

    return res.status(200).json({
      services: [...services],
      totalServices,
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

    const existingUser = await UserModel.findOne({ email });

    let newService: any = {
      assistant: existingUser?._id,
      description,
      wage,
      availableDays,
      greetings,
      isDriver,
      location,
      images: imagesArray,
      isTrained,
      isAuthorized,
      bankAccount,
    };

    if (req.files.trainingCert) {
      const trainingCert: any = [...req.files.trainingCert as any];
      const trainingCertArray: string[] = [];
      trainingCert.forEach((element: any) => {
        trainingCertArray.push(element.key);
      });
      newService = { ...newService, trainingCert: trainingCertArray };
    }
    if (req.files.orgAuth) {
      const orgAuth: any = [...req.files.orgAuth as any];
      const orgAuthArray: string[] = [];
      orgAuth.forEach((element: any) => {
        orgAuthArray.push(element.key);
      });
      newService = { ...newService, orgAuth: orgAuthArray };
    }

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
    if (isAuthorized) {
      serviceDetails = { ...serviceDetails, isAuthorized };
    }
    if (bankAccount) {
      serviceDetails = { ...serviceDetails, bankAccount };
    }

    if (req.files) {
      if (req.files.images) {
        const images: any = [...req.files.images as any];
        const imagesArray: string[] = [];
        images.forEach((element: any) => {
          imagesArray.push(element.key);
        });
        serviceDetails = { ...serviceDetails, images: imagesArray };
      }

      if (req.files.trainingCert) {
        const trainingCert: any = [...req.files.trainingCert as any];
        const trainingCertArray: string[] = [];
        trainingCert.forEach((element: any) => {
          trainingCertArray.push(element.key);
        });
        serviceDetails = { ...serviceDetails, trainingCert: trainingCertArray };
      }

      if (req.files.orgAuth) {
        const orgAuth: any = [...req.files.orgAuth as any];
        const orgAuthArray: string[] = [];
        orgAuth.forEach((element: any) => {
          orgAuthArray.push(element.key);
        });
        serviceDetails = { ...serviceDetails, orgAuth: orgAuthArray };
      }
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

    ReviewModel.remove({ service: service._id }).exec();
    await OrderModel.updateMany({ service: service._id }, { assistant: null, service: null });

    ServiceModel.findByIdAndDelete(service._id).exec();
    await UserModel.findByIdAndUpdate(existingService?.assistant, { isAssistant: false }).exec();

    return res.status(200).json({ message: '서비스 정보를 삭제했습니다' });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
