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
exports.completePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const order_1 = __importDefault(require("../models/order"));
const completePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { impUid } = req.body;
        // const impUid = 'imp_414902886372';
        const getToken = yield axios_1.default({
            url: 'https://api.iamport.kr/users/getToken',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                imp_key: process.env.IMP_KEY,
                imp_secret: process.env.IMP_SECRET,
            },
        });
        const accessToken = getToken.data.response.access_token;
        console.log(getToken.data);
        const getPaymentData = yield axios_1.default({
            url: `https://api.iamport.kr/payments/${impUid}`,
            method: 'get',
            headers: { Authorization: accessToken },
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        // DB에서 결제되어야 하는 금액 조회
        const { order } = req;
        // 결제 검증하기
        console.log(paymentData);
        const { amount, status } = paymentData;
        console.log(amount, status);
        console.log(order.totalPayment);
        if (amount === order.totalPayment) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            yield order_1.default.findByIdAndUpdate(order._id, { state: 'complete' }).exec(); // DB에 결제 정보 저장
            if (status === 'paid') {
                return res.status(200).json({ status: 'success', message: '일반 결제 성공' });
            }
        }
        // 결제 금액 불일치. 위/변조 된 결제
        return res.status(400).json({ status: 'failure', message: '결제 금액이 일치하지 않습니다' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.completePayment = completePayment;
