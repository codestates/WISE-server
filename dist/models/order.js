"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-bitwise */
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    assistant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'service',
        required: true,
    },
    pickup: {
        type: String,
        required: true,
    },
    hospital: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    },
    totalPayment: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
        enum: [
            'apply',
            'accept',
            'complete',
        ],
    },
    isReviewed: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.model('order', OrderSchema);
