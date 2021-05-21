"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const auth_2 = require("../controllers/auth");
const router = express_1.Router();
router.post('/email-validation', auth_2.validateEmail);
router.post('/signup', auth_1.default, auth_2.signup);
router.post('/signin', auth_1.default, auth_2.signin);
exports.default = router;
