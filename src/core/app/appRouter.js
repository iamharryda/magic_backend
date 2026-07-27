import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import donationRoutes from '../../entities/donation/donation.routes.js';
import sponsorshipRoutes from '../../entities/sponsorship/sponsorship.routes.js';
import projectRoutes from '../../entities/project/project.routes.js';
import contactRoutes from '../../entities/contact/contact.routes.js';
import careerRoutes from '../../entities/career/career.routes.js';
import newsRoutes from '../../entities/news/news.routes.js';
import blogRoutes from '../../entities/blog/blog.routes.js';
import eventRoutes from '../../entities/event/event.routes.js';
import reportRoutes from '../../entities/report/report.routes.js';
import yearbookRoutes from '../../entities/yearbook/yearbook.routes.js';
import volunteerRoutes from '../../entities/volunteer/volunteer.routes.js';
import partnerRoutes from '../../entities/partner/partner.routes.js';
import awardRoutes from '../../entities/award/award.routes.js';
import uploadRoutes from '../../entities/upload/upload.routes.js';
import { edgeStoreHandler } from '../../lib/edgestore.js';

const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/donation', donationRoutes);
router.use('/v1/sponsorship', sponsorshipRoutes);
router.use('/v1/project', projectRoutes);
router.use('/v1/contact', contactRoutes);
router.use('/v1/career', careerRoutes);
router.use('/v1/news', newsRoutes);
router.use('/v1/blog', blogRoutes);
router.use('/v1/event', eventRoutes);
router.use('/v1/report', reportRoutes);
router.use('/v1/yearbook', yearbookRoutes);
router.use('/v1/volunteer', volunteerRoutes);
router.use('/v1/partner', partnerRoutes);
router.use('/v1/award', awardRoutes);
router.use('/v1/upload', uploadRoutes);
router.all('/v1/edgestore/*', edgeStoreHandler);

export default router;


