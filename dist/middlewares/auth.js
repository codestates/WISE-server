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
const firebase_1 = __importDefault(require("../firebase"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.header('accessToken');
        if (!accessToken) {
            return res.status(400).json({ message: '로그인을 해주세요' });
        }
        firebase_1.default.auth().verifyIdToken(accessToken).then((authenticatedUser) => {
            req.authUser = authenticatedUser;
            return next();
        }).catch(() => res.status(400).json({
            message: '로그인을 다시 해주세요',
        }));
    }
    catch (error) {
        return res.status(500).json({
            message: '서버 에러로 요청을 처리할 수 없습니다',
        });
    }
});
exports.default = auth;
