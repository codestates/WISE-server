/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { serviceById, isServiceUser } from '../middlewares/service';
import {
  getService, createService, updateService, deleteService, getAllServices, getServicesBySearch, getPopularServices, getScheduleByServices,
} from '../controllers/service';
import { upload } from '../utils/s3';

const router = Router();

router.get('/services/all', getAllServices);
router.get('/services/popularity', getPopularServices);
router.get('/services/schedule', getScheduleByServices);
router.get('/services/:serviceId', getService);
router.get('/services', getServicesBySearch);
router.post('/services', auth, upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'trainingCert', maxCount: 3 },
  { name: 'orgAuth', maxCount: 3 },
]), createService);
router.patch('/services/:serviceId', auth, isServiceUser, upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'trainingCert', maxCount: 3 },
  { name: 'orgAuth', maxCount: 3 },
]), updateService);
router.delete('/services/:serviceId', auth, isServiceUser, deleteService);

router.param('serviceId', serviceById);

export default router;
