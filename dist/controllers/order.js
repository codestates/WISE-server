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
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrdersByUser = exports.getOrder = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const service_1 = __importDefault(require("../models/service"));
const order_1 = __importDefault(require("../models/order"));
dotenv_1.default.config();
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order } = req;
        const existingOrder = yield order_1.default
            .findById(order._id)
            .populate('assistant', 'name')
            .populate('customer', 'name')
            .lean();
        return res.status(200).json({
            order: Object.assign({}, existingOrder),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getOrder = getOrder;
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const { userId, type } = req.query;
        const existingUser = yield user_1.default.findById(userId);
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) !== email) {
            return res.status(401).json({
                message: '유저 권한이 없습니다',
            });
        }
        const orders = yield order_1.default
            .find({ [type]: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id })
            .populate('assistant', 'name')
            .populate('customer', 'name')
            .lean();
        return res.status(200).json({
            orders: [...orders],
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.getOrdersByUser = getOrdersByUser;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const { message, serviceId, pickup, hospital, content, date, time, hours, totalPayment, } = req.body;
        const customer = yield user_1.default.findOne({ email });
        const service = yield service_1.default.findById(serviceId);
        const newOrder = {
            customer: customer === null || customer === void 0 ? void 0 : customer._id,
            assistant: service === null || service === void 0 ? void 0 : service.assistant,
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
        };
        const result = yield order_1.default
            .create(newOrder);
        const order = yield order_1.default
            .findById(result._id)
            .populate('assistant', 'name')
            .populate('customer', 'name')
            .lean();
        return res.status(200).json({
            order: Object.assign({}, order),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orderDetails = {};
        const { state } = req.body;
        if (state) {
            orderDetails = Object.assign(Object.assign({}, orderDetails), { state });
        }
        const { order } = req;
        yield order_1.default
            .findByIdAndUpdate(order._id, orderDetails)
            .exec();
        const updatedOrder = yield order_1.default
            .findById(order._id)
            .populate('assistant', 'name')
            .populate('customer', 'name')
            .lean();
        return res.status(200).json({
            order: Object.assign({}, updatedOrder),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order } = req;
        yield order_1.default.findById(order._id).exec();
        yield order_1.default.findByIdAndDelete(order._id).exec();
        return res.status(200).json({
            message: '신청이 취소되었습니다',
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.deleteOrder = deleteOrder;
