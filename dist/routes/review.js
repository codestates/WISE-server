"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const review_1 = require("../controllers/review");
const router = express_1.Router();
router.get('/reviews', review_1.getReviews);
router.post('/reviews', auth_1.default, review_1.createReview);
exports.default = router;
