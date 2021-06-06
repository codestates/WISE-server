"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const order_1 = require("../middlewares/order");
const order_2 = require("../controllers/order");
const router = express_1.Router();
router.get('/orders/:orderId', auth_1.default, order_1.isOrderUser, order_2.getOrder);
router.get('/orders', auth_1.default, order_2.getOrdersByUser);
router.post('/orders', auth_1.default, order_2.createOrder);
router.patch('/orders/:orderId', auth_1.default, order_1.isOrderUser, order_2.updateOrder);
router.delete('/orders/:orderId', auth_1.default, order_1.isOrderUser, order_2.deleteOrder);
router.param('orderId', order_1.orderById);
exports.default = router;
