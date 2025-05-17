import { Request, Response } from 'express';
import NotificationService from '../services/notificationService';

class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    public async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const notifications = await this.notificationService.getNotificationsByUserId(userId);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving notifications', error });
        }
    }

    public async createNotification(req: Request, res: Response): Promise<void> {
        try {
            const notificationData = req.body;
            const newNotification = await this.notificationService.createNotification(notificationData);
            res.status(201).json(newNotification);
        } catch (error) {
            res.status(500).json({ message: 'Error creating notification', error });
        }
    }

    public async deleteNotification(req: Request, res: Response): Promise<void> {
        try {
            const notificationId = req.params.id;
            await this.notificationService.deleteNotification(notificationId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting notification', error });
        }
    }
}

export default NotificationController;