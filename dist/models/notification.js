"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    recipient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    subject: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    clientUrl: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    isChecked: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.model('notification', NotificationSchema);
