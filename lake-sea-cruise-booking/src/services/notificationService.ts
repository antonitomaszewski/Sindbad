import { Notification } from '../models/Notification';

export class NotificationService {
    private notifications: Notification[] = [];

    public createNotification(userId: string, message: string): Notification {
        const notification = new Notification(userId, message);
        this.notifications.push(notification);
        return notification;
    }

    public getNotificationsForUser(userId: string): Notification[] {
        return this.notifications.filter(notification => notification.userId === userId);
    }

    public deleteNotification(notificationId: string): boolean {
        const index = this.notifications.findIndex(notification => notification.id === notificationId);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            return true;
        }
        return false;
    }

    public notifyUser(userId: string, message: string): void {
        // Logic to send notification to the user (e.g., via email or push notification)
        console.log(`Notification sent to user ${userId}: ${message}`);
    }
}