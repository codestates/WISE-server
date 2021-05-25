/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { validateEmail, signup, signin } from '../controllers/auth';

const router = Router();

router.post('/validation/email', validateEmail);
router.post('/signup', auth, signup);
router.post('/signin', auth, signin);

export default router;
