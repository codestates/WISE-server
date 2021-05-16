/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { signup, signin } from '../controllers/auth';

const router = Router();

router.post('/signup', auth, signup);
router.post('/signin', auth, signin);

export default router;