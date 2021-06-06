"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const notification_1 = require("../middlewares/notification");
const notification_2 = require("../controllers/notification");
const router = express_1.Router();
router.get('/notifications', auth_1.default, notification_2.getNotificationsByUser);
router.post('/notifications', auth_1.default, notification_2.createNotification);
router.patch('/notifications/:notificationId', auth_1.default, notification_1.isNotificationUser, notification_2.updateNotification);
router.delete('/notifications/:notificationId', auth_1.default, notification_1.isNotificationUser, notification_2.deleteNotification);
router.delete('/notifications/all', auth_1.default, notification_2.deleteAllNotifications);
router.param('notificationId', notification_1.notificationById);
exports.default = router;
