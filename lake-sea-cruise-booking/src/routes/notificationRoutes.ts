import { Router } from 'express';
import NotificationController from '../controllers/notificationController';

const router = Router();
const notificationController = new NotificationController();

// Route to get notifications for a user
router.get('/:userId', notificationController.getNotifications);

// Route to create a new notification
router.post('/', notificationController.createNotification);

// Route to delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

export default router;