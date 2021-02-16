import { Router } from 'express';
import PageRouter from './Article';
import AuthRouter from './Auth';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/article', PageRouter);
router.use('/auth', AuthRouter);

// Export the base-router
export default router;
