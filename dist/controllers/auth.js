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
exports.signin = exports.signup = exports.validateEmail = void 0;
const service_1 = __importDefault(require("../models/service"));
const user_1 = __importDefault(require("../models/user"));
const validateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existingUser = yield user_1.default.findOne({ email }).lean();
        if (existingUser) {
            return res.status(409).json({
                message: '이미 회원가입 되어있는 유저입니다',
            });
        }
        return res.status(200).json({
            message: '회원 가입이 가능합니다',
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.validateEmail = validateEmail;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, mobile, signinMethod, } = req.body;
        const existingUser = yield user_1.default.findOne({ email }).lean();
        if (existingUser) {
            return res.status(409).json({
                message: '이미 회원가입 되어있는 유저입니다',
            });
        }
        const newUser = {
            email,
            name,
            mobile,
            signinMethod,
        };
        yield user_1.default.create(newUser);
        const user = yield user_1.default.findOne({ email }).select('-isAssistant -signinMethod').lean();
        user.service = '';
        return res.status(201).json({
            user: Object.assign({}, user),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authUser } = req;
        const { signinMethod } = req.body;
        const existingUser = yield user_1.default.findOne({ email: authUser.email }).lean();
        // 기존에 가입되어 있지 않은 회원이라면,
        // 새롭게 회원 가입한다.
        if (!existingUser) {
            const { name, email } = authUser;
            const newUser = {
                email,
                name,
                signinMethod,
            };
            yield user_1.default.create(newUser);
            const user = yield user_1.default.findOne({ email }).select('-isAssistant -signinMethod').lean();
            const existingService = yield service_1.default.findOne({ assistant: user._id });
            if (existingService) {
                user.service = existingService._id;
            }
            else {
                user.service = '';
            }
            return res.status(200).json({
                user: Object.assign({}, user),
            });
        }
        // DB에 존재하는 유저의 signinMethod와
        // 클라이언트로부터 받은 signinMethod가 다르다면
        // 로그인이 안된다는 메세지를 반환한다.
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.signinMethod) !== signinMethod) {
            return res.status(400).json({
                message: '로그인 방식이 올바르지 않습니다',
            });
        }
        existingUser === null || existingUser === void 0 ? true : delete existingUser.isAssistant;
        existingUser === null || existingUser === void 0 ? true : delete existingUser.signinMethod;
        const existingService = yield service_1.default.findOne({ assistant: existingUser._id });
        if (existingService) {
            existingUser.service = existingService._id;
        }
        else {
            existingUser.service = '';
        }
        // 새로 가입하는 경우도 아니고, signinMethod도 일치한다면, 바로 로그인 성공
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
exports.signin = signin;
