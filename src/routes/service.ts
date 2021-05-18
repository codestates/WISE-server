/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { serviceById, isSameAssistant } from '../middlewares/service';
import {
  getService, createService, updateService, deleteService,
} from '../controllers/service';
import { upload } from '../utils/s3';

const router = Router();

router.get('/services/:serviceId', getService);
router.post('/services', auth, upload.array('images', 3), createService);
router.patch('/services/:serviceId', auth, isSameAssistant, upload.array('images', 3), updateService);
router.delete('/services/:serviceId', auth, isSameAssistant, deleteService);

router.param('serviceId', serviceById);

export default router;
