import { Router } from 'express';
import BookingController from '../controllers/bookingController';

const router = Router();
const bookingController = new BookingController();

// Route to create a new booking
router.post('/', bookingController.createBooking);

// Route to update an existing booking
router.put('/:id', bookingController.updateBooking);

// Route to cancel a booking
router.delete('/:id', bookingController.cancelBooking);

// Route to get all bookings for a user
router.get('/user/:userId', bookingController.getUserBookings);

// Route to get booking details by ID
router.get('/:id', bookingController.getBookingById);

export default router;