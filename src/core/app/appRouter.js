import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import donationRoutes from '../../entities/donation/donation.routes.js';
import sponsorshipRoutes from '../../entities/sponsorship/sponsorship.routes.js';
import projectRoutes from '../../entities/project/project.routes.js';

const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/donation', donationRoutes);
router.use('/v1/sponsorship', sponsorshipRoutes);
router.use('/v1/project', projectRoutes);


export default router;

