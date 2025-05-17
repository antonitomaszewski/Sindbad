import { Router } from 'express';
import OrganizerController from '../controllers/organizerController';

const router = Router();
const organizerController = new OrganizerController();

// Route to create a new organizer profile
router.post('/create', organizerController.createProfile);

// Route to edit an existing organizer profile
router.put('/edit/:id', organizerController.editProfile);

// Route to get organizer profile by ID
router.get('/:id', organizerController.getProfile);

// Route to delete an organizer profile
router.delete('/delete/:id', organizerController.deleteProfile);

export default router;