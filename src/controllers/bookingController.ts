import { Request, Response } from 'express';
import { booking } from '../data/booking';
import { cruise } from '../data/cruise';
import { Booking } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/emailService';

export const createBooking = (req: Request, res: Response) => {
    const { cruiseId, userEmail, seats } = req.body;

    if (!cruiseId || !userEmail || !seats) {
        res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
        return;
    }

    const _cruise = cruise.find(c => c.id === cruiseId);
    if (!_cruise) {
        res.status(404).json({ message: 'Rejs nie istnieje.' });
        return;
    }

    if (_cruise.availableSeats < seats) {
        res.status(400).json({ message: 'Brak wystarczającej liczby miejsc.' });
        return;
    }

    _cruise.availableSeats -= seats;

    const newBooking: Booking = {
        id: uuidv4(),
        cruiseId,
        userEmail,
        seats,
        createdAt: new Date().toISOString(),
    };

    booking.push(newBooking);

    sendEmail(
        userEmail,
        'Potwierdzenie rezerwacji',
        `Twoja rezerwacja na rejs ${_cruise.name} została przyjęta.`
    );

    res.status(201).json({ message: 'Rezerwacja utworzona.', booking: newBooking });
};
