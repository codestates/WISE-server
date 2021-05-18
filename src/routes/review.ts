/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import auth from '../middlewares/auth';
import { getReviews, createReview } from '../controllers/review';

const router = Router();

router.get('/reviews', getReviews);
router.post('/reviews', auth, createReview);

export default router;
