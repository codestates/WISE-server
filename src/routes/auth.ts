/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { signup } from '../controllers/auth';

const router = Router();

router.post('/signup', auth, signup);

export default router;
