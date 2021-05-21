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
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId, page } = req.query;
        const reviewsPerPage = 6;
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
        const { serviceId, content } = req.body;
        const { email } = req.authUser;
        const existingUser = yield user_1.default.findOne({ email });
        const newReview = {
            content,
            service: serviceId,
            customer: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
        };
        const result = yield review_1.default.create(newReview);
        console.log('result는? ', result);
        const review = yield review_1.default.findById(result._id).lean();
        console.log('review는?', review);
        return res.status(200).json({
            review: Object.assign({}, review),
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
    }
});
exports.createReview = createReview;
