"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const reservation_1 = require("../middlewares/reservation");
const user_1 = require("../middlewares/user");
const reservation_2 = require("../controllers/reservation");
const router = express_1.Router();
router.get('/reservations/:userId', auth_1.default, user_1.isSameUser, reservation_2.getReservation);
router.post('/reservations', auth_1.default, reservation_2.createReservation);
router.patch('/reservations/:reservationId', auth_1.default, reservation_1.isSameAssistant, reservation_2.updateReservation);
router.delete('/reservations/:reservationId', auth_1.default, reservation_1.isSameAssistant, reservation_2.deleteReservation);
router.param('userId', user_1.userById);
router.param('reservationId', reservation_1.reservationById);
exports.default = router;
