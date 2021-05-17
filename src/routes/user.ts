/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { userById, isSameUser } from '../middlewares/user';
import { getUser, updateUser, deleteUser } from '../controllers/user';
import { upload } from '../utils/s3';

const router = Router();

router.get('/users/:userId', getUser);
router.patch('/users/:userId', auth, isSameUser, upload.single('image'), updateUser);
router.delete('/users/:userId', auth, isSameUser, deleteUser);

router.param('userId', userById);

export default router;
