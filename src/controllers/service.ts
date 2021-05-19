/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Response } from 'express';
import UserModel from '../models/user';
import ServiceModel, { Service } from '../models/service';
import { deleteImage } from '../utils/s3';

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
      description, wage, availableDays, availableTimes, greetings, isDriver, location, isTrained, isAuthorized,
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
      availableTimes,
      greetings,
      isDriver,
      location,
      images: imagesArray,
      isTrained,
      trainingCert: trainingCertArray,
      isAuthorized,
      orgAuth: orgAuthArray,
    };

    await ServiceModel.create(newService);
    const existingService = await ServiceModel.findOne({ assistant: existingUser?._id }).lean();

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
      description, wage, availableDays, availableTimes, greetings, isDriver, location, isTrained, isAuthorized,
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
    if (availableTimes) {
      serviceDetails = { ...serviceDetails, availableTimes };
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

    return res.status(200).json({ message: '서비스 정보를 삭제했습니다' });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};
