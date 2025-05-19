import { Request, Response } from 'express';
import { cruises } from '../data/cruises';
import { Cruise } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Dodawanie nowego rejsu
export const addCruise = (req: Request, res: Response) => {
    const { name, description, date, location, availableSeats, organizerEmail } = req.body;

    if (!name || !description || !date || !location || !availableSeats || !organizerEmail) {
        res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
        return;
    }

    const newCruise: Cruise = {
        id: uuidv4(),
        name,
        description,
        date,
        location,
        availableSeats,
        organizerEmail,
    };

    cruises.push(newCruise);
    res.status(201).json({ message: 'Rejs dodany pomyślnie.', cruise: newCruise });
};

// Pobieranie wszystkich rejsów
export const getCruises = (_req: Request, res: Response) => {
    res.status(200).json(cruises);
};