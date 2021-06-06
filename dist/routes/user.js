"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const user_1 = require("../middlewares/user");
const user_2 = require("../controllers/user");
const s3_1 = require("../utils/s3");
const router = express_1.Router();
router.get('/users/:userId', user_2.getUser);
router.patch('/users/:userId', auth_1.default, user_1.isSameUser, s3_1.upload.single('image'), user_2.updateUser);
router.delete('/users/:userId', auth_1.default, user_1.isSameUser, user_2.deleteUser);
router.param('userId', user_1.userById);
exports.default = router;
