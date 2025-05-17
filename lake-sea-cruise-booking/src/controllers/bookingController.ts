import { Request, Response } from 'express';
import BookingService from '../services/bookingService';

class BookingController {
    private bookingService: BookingService;

    constructor() {
        this.bookingService = new BookingService();
    }

    public createBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookingData = req.body;
            const newBooking = await this.bookingService.createBooking(bookingData);
            res.status(201).json(newBooking);
        } catch (error) {
            res.status(500).json({ message: 'Error creating booking', error });
        }
    };

    public updateBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookingId = req.params.id;
            const updatedData = req.body;
            const updatedBooking = await this.bookingService.updateBooking(bookingId, updatedData);
            res.status(200).json(updatedBooking);
        } catch (error) {
            res.status(500).json({ message: 'Error updating booking', error });
        }
    };

    public cancelBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookingId = req.params.id;
            await this.bookingService.cancelBooking(bookingId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error canceling booking', error });
        }
    };

    public getBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookingId = req.params.id;
            const booking = await this.bookingService.getBooking(bookingId);
            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving booking', error });
        }
    };

    public getAllBookings = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookings = await this.bookingService.getAllBookings();
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings', error });
        }
    };
}

export default BookingController;