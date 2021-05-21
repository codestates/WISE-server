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
exports.isSameUser = exports.userById = void 0;
const user_1 = __importDefault(require("../models/user"));
const userById = (req, res, next, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: '유저가 존재하지 않습니다',
            });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.userById = userById;
const isSameUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSame = req.user.email === req.authUser.email;
        if (!isSame) {
            return res.status(403).json({
                message: '유저 권한이 없습니다',
            });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.isSameUser = isSameUser;
