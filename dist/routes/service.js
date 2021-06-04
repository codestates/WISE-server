"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const service_1 = require("../middlewares/service");
const service_2 = require("../controllers/service");
const s3_1 = require("../utils/s3");
const router = express_1.Router();
router.get('/services/all', service_2.getAllServices);
router.get('/services/popularity', service_2.getPopularServices);
router.get('/services/schedule', service_2.getScheduleByServices);
router.get('/services/:serviceId', service_2.getService);
router.get('/services', service_2.getServicesBySearch);
router.post('/services', auth_1.default, s3_1.upload.fields([
    { name: 'images', maxCount: 3 },
    { name: 'trainingCert', maxCount: 3 },
    { name: 'orgAuth', maxCount: 3 },
]), service_2.createService);
router.patch('/services/:serviceId', auth_1.default, service_1.isServiceUser, s3_1.upload.fields([
    { name: 'images', maxCount: 3 },
    { name: 'trainingCert', maxCount: 3 },
    { name: 'orgAuth', maxCount: 3 },
]), service_2.updateService);
router.delete('/services/:serviceId', auth_1.default, service_1.isServiceUser, service_2.deleteService);
router.param('serviceId', service_1.serviceById);
exports.default = router;
