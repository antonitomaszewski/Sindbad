export class Payment {
    constructor(
        public id: string,
        public userId: string,
        public offerId: string,
        public amount: number,
        public currency: string,
        public status: 'pending' | 'completed' | 'failed',
        public transactionDate: Date
    ) {}
}