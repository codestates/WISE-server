"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReservationSchema = new mongoose_1.Schema({
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
    home: {
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
}, { timestamps: true });
exports.default = mongoose_1.model('reservation', ReservationSchema);
