"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ServiceSchema = new mongoose_1.Schema({
    assistant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    wage: {
        type: Number,
        required: true,
    },
    availableDays: [
        {
            type: String,
            required: true,
        },
    ],
    greetings: {
        type: String,
        trim: true,
        required: true,
    },
    isDriver: {
        type: Boolean,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    isTrained: {
        type: Boolean,
        required: true,
    },
    trainingCert: [
        {
            type: String,
            required: true,
        },
    ],
    isAuthorized: {
        type: Boolean,
        required: true,
    },
    orgAuth: [
        {
            type: String,
            required: true,
        },
    ],
    starRating: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
    },
}, { timestamps: true });
exports.default = mongoose_1.model('service', ServiceSchema);
