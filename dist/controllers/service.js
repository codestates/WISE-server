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
exports.deleteService = exports.updateService = exports.createService = exports.getAllServices = exports.getPopularServices = exports.getServices = exports.getService = void 0;
const moment_1 = __importDefault(require("moment"));
const user_1 = __importDefault(require("../models/user"));
const service_1 = __importDefault(require("../models/service"));
const order_1 = __importDefault(require("../models/order"));
const review_1 = __importDefault(require("../models/review"));
const s3_1 = require("../utils/s3");
const getService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { service } = req;
        const existingService = yield service_1.default.findById(service._id).populate('assistant', 'name').lean();
        return res.status(200).json({
            service: Object.assign({}, existingService),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getService = getService;
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, date, time, page, } = req.query;
        const searchPerPage = 16;
        const orders = yield order_1.default.find({
            date: {
                $gte: moment_1.default(date).startOf('day').toDate(),
                $lte: moment_1.default(date).endOf('day').toDate(),
            },
            time,
            state: { $in: ['accept', 'complete'] },
        }).select('assistant');
        const bookedOrders = [];
        orders.forEach((element) => {
            bookedOrders.push(element.assistant);
        });
        const day = `${moment_1.default(date).format('dddd')} ${time}`;
        const services = yield service_1.default.find({
            assistant: { $nin: bookedOrders }, location, availableDays: day,
        })
            .sort({ _id: 1, starRating: -1 })
            .skip((Number(page) - 1) * searchPerPage)
            .limit(searchPerPage)
            .select('assistant images wage greetings location starRating')
            .populate('assistant', 'name')
            .lean();
        const totalServices = yield service_1.default.find({
            assistant: { $nin: bookedOrders }, location, availableDays: day,
        }).countDocuments();
        return res.status(200).json({
            services: [...services],
            totalServices,
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getServices = getServices;
const getPopularServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularServices = yield service_1.default.find({})
            .sort({ _id: 1, starRating: -1 })
            .limit(8)
            .select('assistant images wage greetings location starRating')
            .populate('assistant', 'name')
            .lean();
        return res.status(200).json({
            popularServices: [...popularServices],
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getPopularServices = getPopularServices;
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.query;
        const searchPerPage = 16;
        const services = yield service_1.default.find({})
            .sort({ _id: 1, starRating: -1 })
            .skip(8 + (Number(page) - 1) * searchPerPage)
            .limit(searchPerPage)
            .select('assistant images wage greetings location starRating')
            .populate('assistant', 'name')
            .lean();
        const totalServices = yield service_1.default.find({}).countDocuments();
        return res.status(200).json({
            services: [...services],
            totalServices,
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getAllServices = getAllServices;
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const { description, wage, availableDays, greetings, isDriver, location, isTrained, isAuthorized, bankAccount, } = req.body;
        const images = [...req.files.images];
        const imagesArray = [];
        images.forEach((element) => {
            imagesArray.push(element.key);
        });
        const existingUser = yield user_1.default.findOne({ email });
        let newService = {
            assistant: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
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
            const trainingCert = [...req.files.trainingCert];
            const trainingCertArray = [];
            trainingCert.forEach((element) => {
                trainingCertArray.push(element.key);
            });
            newService = Object.assign(Object.assign({}, newService), { trainingCert: trainingCertArray });
        }
        if (req.files.orgAuth) {
            const orgAuth = [...req.files.orgAuth];
            const orgAuthArray = [];
            orgAuth.forEach((element) => {
                orgAuthArray.push(element.key);
            });
            newService = Object.assign(Object.assign({}, newService), { orgAuth: orgAuthArray });
        }
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
        let serviceDetails = {};
        const { description, wage, availableDays, greetings, isDriver, location, isTrained, isAuthorized, bankAccount, } = req.body;
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
        if (isAuthorized) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { isAuthorized });
        }
        if (bankAccount) {
            serviceDetails = Object.assign(Object.assign({}, serviceDetails), { bankAccount });
        }
        if (req.files) {
            if (req.files.images) {
                const images = [...req.files.images];
                const imagesArray = [];
                images.forEach((element) => {
                    imagesArray.push(element.key);
                });
                serviceDetails = Object.assign(Object.assign({}, serviceDetails), { images: imagesArray });
            }
            if (req.files.trainingCert) {
                const trainingCert = [...req.files.trainingCert];
                const trainingCertArray = [];
                trainingCert.forEach((element) => {
                    trainingCertArray.push(element.key);
                });
                serviceDetails = Object.assign(Object.assign({}, serviceDetails), { trainingCert: trainingCertArray });
            }
            if (req.files.orgAuth) {
                const orgAuth = [...req.files.orgAuth];
                const orgAuthArray = [];
                orgAuth.forEach((element) => {
                    orgAuthArray.push(element.key);
                });
                serviceDetails = Object.assign(Object.assign({}, serviceDetails), { orgAuth: orgAuthArray });
            }
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
        review_1.default.remove({ service: service._id }).exec();
        yield order_1.default.updateMany({ service: service._id }, { assistant: null, service: null });
        service_1.default.findByIdAndDelete(service._id).exec();
        yield user_1.default.findByIdAndUpdate(existingService === null || existingService === void 0 ? void 0 : existingService.assistant, { isAssistant: false }).exec();
        return res.status(200).json({ message: '서비스 정보를 삭제했습니다' });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.deleteService = deleteService;
