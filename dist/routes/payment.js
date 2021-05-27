"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const order_1 = require("../middlewares/order");
const payment_1 = require("../controllers/payment");
const router = express_1.Router();
router.post('/payments/:orderId', auth_1.default, payment_1.completePayment);
router.param('orderId', order_1.orderById);
exports.default = router;
