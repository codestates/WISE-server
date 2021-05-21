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
exports.deleteReservation = exports.updateReservation = exports.createReservation = exports.getReservation = void 0;
const user_1 = __importDefault(require("../models/user"));
const service_1 = __importDefault(require("../models/service"));
const reservation_1 = __importDefault(require("../models/reservation"));
const getReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const existingUser = yield user_1.default.findById(user.id);
        let reservation;
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isAssistant) {
            reservation = yield reservation_1.default.findOne({ assistant: existingUser._id }).lean();
        }
        else {
            reservation = yield reservation_1.default.findOne({ customer: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id }).lean();
        }
        return res.status(200).json({
            reservation: Object.assign({}, reservation),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getReservation = getReservation;
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.authUser;
        const customer = yield user_1.default.findOne({ email });
        const { state, serviceId, home, hospital, content, date, time, hours, totalPayment, } = req.body;
        const assistant = yield service_1.default.findById(serviceId);
        const newReservation = {
            customer: customer === null || customer === void 0 ? void 0 : customer._id,
            assistant: assistant === null || assistant === void 0 ? void 0 : assistant.assistant,
            service: serviceId,
            home,
            hospital,
            content,
            date,
            time,
            hours,
            totalPayment,
            state,
        };
        const result = yield reservation_1.default.create(newReservation);
        const reservation = yield reservation_1.default.findById(result._id).lean();
        return res.status(200).json({
            reservation: Object.assign({}, reservation),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.createReservation = createReservation;
const updateReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reservationDetails = {};
        const { state } = req.body;
        if (state) {
            reservationDetails = Object.assign(Object.assign({}, reservationDetails), { state });
        }
        const { reservation } = req;
        yield reservation_1.default.findByIdAndUpdate(reservation._id, reservationDetails).exec();
        const updatedReservation = yield reservation_1.default.findById(reservation._id).lean();
        return res.status(200).json({
            reservation: Object.assign({}, updatedReservation),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.updateReservation = updateReservation;
const deleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reservation } = req;
        yield reservation_1.default.findById(reservation._id).exec();
        reservation_1.default.findByIdAndDelete(reservation._id).exec();
        return res.status(200).json({ message: '예약 정보를 삭제했습니다' });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.deleteReservation = deleteReservation;
