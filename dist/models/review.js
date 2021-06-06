"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'service',
        required: true,
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, { timestamps: true });
exports.default = mongoose_1.model('review', ReviewSchema);
