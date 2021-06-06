"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    signinMethod: {
        type: String,
        required: true,
        enum: [
            'password',
            'google',
            'facebook',
        ],
    },
    mobile: {
        type: String,
        trim: true,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    isAssistant: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.model('user', UserSchema);
