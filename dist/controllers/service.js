"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = exports.getAllServices = exports.deleteService = exports.updateService = exports.createService = exports.getService = void 0;
const moment_1 = __importDefault(require("moment"));
const user_1 = __importDefault(require("../models/user"));
const service_1 = __importDefault(require("../models/service"));
const s3_1 = require("../utils/s3");
const reservation_1 = __importDefault(require("../models/reservation"));
const getService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { service } = req;
        const existingService = yield service_1.default.findById(service._id).lean();
        return res.status(200).json({
            service: Object.assign({}, existingService),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getService = getService;
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const { description, wage, availableDays, greetings, isDriver, location, isTrained, isAuthorized, } = req.body;
        const images = [...req.files.images];
        const imagesArray = [];
        images.forEach((element) => {
            imagesArray.push(element.key);
        });
        const trainingCert = [...req.files.trainingCert];
        const trainingCertArray = [];
        trainingCert.forEach((element) => {
            trainingCertArray.push(element.key);
        });
        const orgAuth = [...req.files.orgAuth];
        const orgAuthArray = [];
        orgAuth.forEach((element) => {
            orgAuthArray.push(element.key);
        });
        const existingUser = yield user_1.default.findOne({ email });
        const newService = {
            assistant: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
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
        };
        yield service_1.default.create(newService);
        const existingService = yield service_1.default.findOne({ assistant: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id }).lean();
        yield user_1.default.findByIdAndUpdate(existingUser === null || existingUser === void 0 ? void 0 : existingUser._id, { isAssistant: true }).exec();
        return res.status(200).json({
            service: Object.assign({}, existingService),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.createService = createService;
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = [...req.files.images];
        const imagesArray = [];
        images.forEach((element) => {
            imagesArray.push(element.key);
        });
        const trainingCert = [...req.files.trainingCert];
        const trainingCertArray = [];
        trainingCert.forEach((element) => {
            trainingCertArray.push(element.key);
        });
        const orgAuth = [...req.files.orgAuth];
        const orgAuthArray = [];
        orgAuth.forEach((element) => {
            orgAuthArray.push(element.key);
        });
        let serviceDetails = {};
        const { description, wage, availableDays, greetings, isDriver, location, isTrained, isAuthorized, } = req.body;
        if (description) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { description });
        }
        if (wage) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { wage });
        }
        if (availableDays) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { availableDays });
        }
        if (greetings) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { greetings });
        }
        if (isDriver) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { isDriver });
        }
        if (location) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { location });
        }
        if (wage) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { wage });
        }
        if (isTrained) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { isTrained });
        }
        if (trainingCert) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { trainingCert: trainingCertArray });
        }
        if (isAuthorized) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { isAuthorized });
        }
        if (orgAuth) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { orgAuth: orgAuthArray });
        }
        if (images) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { images: imagesArray });
        }
        const { service } = req;
        const existingService = yield service_1.default.findByIdAndUpdate(service._id, serviceDetails).lean();
        existingService === null || existingService === void 0 ? void 0 : existingService.images.forEach((element) => {
            s3_1.deleteImage(element.split('/')[1]);
        });
        existingService === null || existingService === void 0 ? void 0 : existingService.trainingCert.forEach((element) => {
            s3_1.deleteImage(element.split('/')[1]);
        });
        existingService === null || existingService === void 0 ? void 0 : existingService.orgAuth.forEach((element) => {
            s3_1.deleteImage(element.split('/')[1]);
        });
        const updatedService = yield service_1.default.findById(service._id).lean();
        return res.status(200).json({
            service: Object.assign({}, updatedService),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.updateService = updateService;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { service } = req;
        const existingService = yield service_1.default.findById(service._id).lean();
        existingService === null || existingService === void 0 ? void 0 : existingService.images.forEach((element) => {
            s3_1.deleteImage(element.split('/')[1]);
        });
        existingService === null || existingService === void 0 ? void 0 : existingService.trainingCert.forEach((element) => {
            s3_1.deleteImage(element.split('/')[1]);
        });
        existingService === null || existingService === void 0 ? void 0 : existingService.orgAuth.forEach((element) => {
            s3_1.deleteImage(element.split('/')[1]);
        });
        service_1.default.findByIdAndDelete(service._id).exec();
        yield user_1.default.findByIdAndUpdate(existingService === null || existingService === void 0 ? void 0 : existingService.assistant, { isAssistant: false }).exec();
        return res.status(200).json({ message: '서비스 정보를 삭제했습니다' });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.deleteService = deleteService;
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularService = yield service_1.default.find({})
            .sort({ starRating: -1 })
            .limit(8)
            .select('assistant images wage greetings location starRating')
            .populate('assistant', 'name')
            .lean();
        const { page } = req.query;
        const searchPerPage = 16;
        const service = yield service_1.default.find({})
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
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getAllServices = getAllServices;
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, startDate, endDate, time, } = req.query;
        const reservation = yield reservation_1.default.find({
            date: {
                $gte: moment_1.default(startDate).startOf('day').toDate(),
                $lte: moment_1.default(endDate).endOf('day').toDate(),
            },
            time,
            state: { $in: ['accept', 'complete'] },
        }).select('assistant');
        const newReservation = [];
        reservation.forEach((element) => {
            newReservation.push(element.assistant);
        });
        const Days = [];
        let i = 0;
        while (moment_1.default(startDate).add(i - 1, 'days').format('YYYY-MM-DD') !== moment_1.default(endDate).format('YYYY-MM-DD')) {
            Days.push(`${moment_1.default(startDate).add(i, 'days').format('dddd')} ${time}`);
            i += 1;
            if (i === 7)
                break;
        }
        const { page } = req.query;
        const searchPerPage = 16;
        const service = yield service_1.default.find({
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
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getServices = getServices;
