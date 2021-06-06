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
exports.isOrderUser = exports.orderById = void 0;
const order_1 = __importDefault(require("../models/order"));
const user_1 = __importDefault(require("../models/user"));
const orderById = (req, res, next, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_1.default.findById(orderId);
        if (!order) {
            return res.status(400).json({
                message: '예약이 존재하지 않습니다',
            });
        }
        req.order = order;
        return next();
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.orderById = orderById;
const isOrderUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield user_1.default.findById(req.order.customer);
        const assistant = yield user_1.default.findById(req.order.assistant);
        const isSame = (assistant === null || assistant === void 0 ? void 0 : assistant.email) === req.authUser.email || (customer === null || customer === void 0 ? void 0 : customer.email) === req.authUser.email;
        if (!isSame) {
            return res.status(403).json({ message: '유저 권한이 없습니다' });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.isOrderUser = isOrderUser;
