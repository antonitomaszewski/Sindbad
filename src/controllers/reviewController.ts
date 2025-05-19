import { Request, Response } from 'express';
import { review } from '../data/review';
import { cruise } from '../data/cruise';
import { Review } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Dodawanie opinii do rejsu
export const addReview = (req: Request, res: Response) => {
    const { cruiseId, userEmail, rating, comment } = req.body;

    if (!cruiseId || !userEmail || !rating || typeof comment !== 'string') {
        res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
        return;
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        res.status(400).json({ message: 'Ocena musi być liczbą od 1 do 5.' });
        return;
    }

    const _cruise = cruise.find(c => c.id === cruiseId);
    if (!_cruise) {
        res.status(404).json({ message: 'Rejs nie istnieje.' });
        return;
    }

    const newReview: Review = {
        id: uuidv4(),
        cruiseId,
        userEmail,
        rating,
        comment,
        createdAt: new Date().toISOString(),
    };

    review.push(newReview);
    res.status(201).json({ message: 'Opinia dodana.', review: newReview });
};

// Pobieranie opinii dla danego rejsu
export const getReviewsForCruise = (req: Request, res: Response) => {
    const { cruiseId } = req.params;
    const cruiseReviews = review.filter(r => r.cruiseId === cruiseId);
    res.status(200).json(cruiseReviews);
};