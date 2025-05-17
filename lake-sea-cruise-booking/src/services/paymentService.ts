import { Payment } from '../models/Payment';

export class PaymentService {
    private payments: Payment[] = [];

    public createPayment(paymentData: Partial<Payment>): Payment {
        const newPayment = new Payment(paymentData);
        this.payments.push(newPayment);
        return newPayment;
    }

    public getPaymentById(paymentId: string): Payment | undefined {
        return this.payments.find(payment => payment.id === paymentId);
    }

    public processPayment(paymentId: string): boolean {
        const payment = this.getPaymentById(paymentId);
        if (payment) {
            // Logic to process the payment (e.g., call to payment gateway)
            payment.status = 'Processed';
            return true;
        }
        return false;
    }

    public refundPayment(paymentId: string): boolean {
        const payment = this.getPaymentById(paymentId);
        if (payment && payment.status === 'Processed') {
            // Logic to refund the payment (e.g., call to payment gateway)
            payment.status = 'Refunded';
            return true;
        }
        return false;
    }

    public listPayments(): Payment[] {
        return this.payments;
    }
}