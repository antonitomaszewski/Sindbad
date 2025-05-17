export class Rating {
    userId: string;
    offerId: string;
    score: number;
    comment?: string;

    constructor(userId: string, offerId: string, score: number, comment?: string) {
        this.userId = userId;
        this.offerId = offerId;
        this.score = score;
        this.comment = comment;
    }
}