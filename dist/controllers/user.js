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
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const service_1 = __importDefault(require("../models/service"));
const order_1 = __importDefault(require("../models/order"));
const review_1 = __importDefault(require("../models/review"));
const s3_1 = require("../utils/s3");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const existingUser = yield user_1.default.findById(user.id).lean();
        return res.status(200).json({
            user: Object.assign({}, existingUser),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = Object.assign({}, req.file);
        let userDetails = {};
        const { name, mobile } = req.body;
        if (name) {
            userDetails = Object.assign(Object.assign({}, userDetails), { name });
        }
        if (mobile) {
            userDetails = Object.assign(Object.assign({}, userDetails), { mobile });
        }
        if (image.key) {
            userDetails = Object.assign(Object.assign({}, userDetails), { image: image.key });
        }
        const existingUser = yield user_1.default.findByIdAndUpdate(req.params.userId, userDetails).lean();
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.image) {
            const prevImage = existingUser.image.split('/')[1] || '';
            s3_1.deleteImage(prevImage);
        }
        const user = yield user_1.default.findById(req.params.userId).lean();
        return res.status(200).json({
            user: Object.assign({}, user),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const existingUser = yield user_1.default.findByIdAndDelete(user.id).exec();
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.image) {
            const prevImage = existingUser.image.split('/')[1] || '';
            s3_1.deleteImage(prevImage);
        }
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isAssistant) {
            const existingService = yield service_1.default.findOne({ assistant: user.id }).lean();
            existingService === null || existingService === void 0 ? void 0 : existingService.images.forEach((element) => {
                s3_1.deleteImage(element.split('/')[1]);
            });
            existingService === null || existingService === void 0 ? void 0 : existingService.trainingCert.forEach((element) => {
                s3_1.deleteImage(element.split('/')[1]);
            });
            existingService === null || existingService === void 0 ? void 0 : existingService.orgAuth.forEach((element) => {
                s3_1.deleteImage(element.split('/')[1]);
            });
            review_1.default.remove({ service: existingService === null || existingService === void 0 ? void 0 : existingService._id }).exec();
            yield order_1.default.updateMany({ service: existingService === null || existingService === void 0 ? void 0 : existingService._id }, { assistant: null, service: null });
            service_1.default.findByIdAndDelete(existingService === null || existingService === void 0 ? void 0 : existingService._id).exec();
        }
        return res.status(200).json({
            message: '유저 정보를 삭제했습니다',
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.deleteUser = deleteUser;
