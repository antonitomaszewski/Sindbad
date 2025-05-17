export class Notification {
    userId: string;
    content: string;
    timestamp: Date;

    constructor(userId: string, content: string) {
        this.userId = userId;
        this.content = content;
        this.timestamp = new Date();
    }
}