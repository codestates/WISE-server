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
exports.createReview = exports.getReviews = void 0;
const review_1 = __importDefault(require("../models/review"));
const user_1 = __importDefault(require("../models/user"));
const order_1 = __importDefault(require("../models/order"));
const service_1 = __importDefault(require("../models/service"));
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId, page } = req.query;
        const reviewsPerPage = 4;
        const totalReviews = yield review_1.default.find({ service: serviceId }).countDocuments();
        const reviews = yield review_1.default.find({ service: serviceId })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * reviewsPerPage)
            .limit(reviewsPerPage)
            .populate('customer', '_id name image')
            .lean();
        console.log(reviews);
        console.log(totalReviews);
        return res.status(200).json({
            reviews: [...reviews],
            totalReviews,
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.getReviews = getReviews;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, content, starRating } = req.body;
        const { email } = req.authUser;
        const existingUser = yield user_1.default.findOne({ email });
        const existingOrder = yield order_1.default.findById(orderId);
        // 이미 리뷰가 적힌 주문은 다시 리뷰를 적을 수 없다.
        if (existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.isReviewed) {
            return res.status(403).json({
                message: '리뷰가 이미 작성되었습니다',
            });
        }
        // 주문 기록의 고객과 리뷰 작성 고객이 같지 않다면 에러,
        if (String(existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.customer) !== String(existingUser === null || existingUser === void 0 ? void 0 : existingUser._id)) {
            return res.status(401).json({
                message: '유저 권한이 없습니다',
            });
        }
        const newReview = {
            customer: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
            service: existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.service,
            content,
            starRating,
        };
        const result = yield review_1.default.create(newReview);
        console.log('result는? ', result);
        // 해당 서비스에 별점 추가
        const existingService = yield service_1.default.findById(existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.service);
        const totalReviews = yield review_1.default.find({ service: existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.service })
            .countDocuments();
        console.log('서비스 정보', existingService);
        console.log('리뷰 총 개수', totalReviews);
        const newStarRating = totalReviews === 1
            ? Number(starRating)
            : Number((((existingService === null || existingService === void 0 ? void 0 : existingService.starRating) * (totalReviews - 1)
                + Number(starRating)) / totalReviews).toFixed(1));
        service_1.default.findByIdAndUpdate(existingService === null || existingService === void 0 ? void 0 : existingService._id, { starRating: newStarRating }).exec();
        console.log('새로운 별점', newStarRating);
        yield (existingService === null || existingService === void 0 ? void 0 : existingService.updateOne({ starRating: newStarRating }));
        // isReviewed 업데이트
        yield order_1.default.findByIdAndUpdate(orderId, { isReviewed: true });
        const review = yield review_1.default.findById(result._id)
            .populate('customer', '_id name image')
            .lean();
        return res.status(200).json({
            review: Object.assign({}, review),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.createReview = createReview;
