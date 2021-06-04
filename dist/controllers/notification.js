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
exports.deleteAllNotifications = exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getNotificationsByUser = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const getNotificationsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const { userId } = req.query;
        const existingUser = yield user_1.default.findById(userId);
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) !== email) {
            return res.status(401).json({
                message: '유저 권한이 없습니다',
            });
        }
        const notifications = yield notification_1.default
            .find({ recipient: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name')
            .lean();
        return res.status(200).json({
            notifications: [...notifications],
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.getNotificationsByUser = getNotificationsByUser;
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const user = yield user_1.default.findOne({ email });
        const { recipient, subject, clientUrl, content, } = req.body;
        const newNotification = {
            sender: user === null || user === void 0 ? void 0 : user._id,
            recipient,
            subject,
            clientUrl,
            content,
        };
        const result = yield notification_1.default.create(newNotification);
        const notification = yield notification_1.default
            .findById(result === null || result === void 0 ? void 0 : result._id)
            .populate('sender', 'name')
            .lean();
        return res.status(200).json({
            notification: Object.assign({}, notification),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.createNotification = createNotification;
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notification } = req;
        yield notification_1.default.findByIdAndUpdate(notification._id, { isChecked: true }).exec();
        const updatedNotification = yield notification_1.default
            .findById(notification._id)
            .populate('sender', 'name')
            .lean();
        return res.status(200).json({
            notification: Object.assign({}, updatedNotification),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.updateNotification = updateNotification;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notification } = req;
        yield notification_1.default.findByIdAndDelete(notification._id).exec();
        return res.status(200).json({
            message: '알림을 삭제했습니다',
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.deleteNotification = deleteNotification;
const deleteAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const user = yield user_1.default.findOne({ email });
        yield notification_1.default.deleteMany({ recipient: user === null || user === void 0 ? void 0 : user._id }).exec();
        return res.status(200).json({
            message: '모든 알림을 삭제했습니다',
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.deleteAllNotifications = deleteAllNotifications;
