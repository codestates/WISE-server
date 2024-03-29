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
exports.isNotificationUser = exports.notificationById = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const notificationById = (req, res, next, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_1.default.findById(notificationId);
        if (!notification) {
            return res.status(400).json({
                message: '알림이 존재하지 않습니다',
            });
        }
        req.notification = notification;
        return next();
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.notificationById = notificationById;
const isNotificationUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipient } = req.notification;
        const { email } = req.authUser;
        const user = yield user_1.default.findById(recipient);
        const isSame = (user === null || user === void 0 ? void 0 : user.email) === email;
        if (!isSame) {
            return res.status(403).json({
                message: '유저 권한이 없습니다',
            });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.isNotificationUser = isNotificationUser;
