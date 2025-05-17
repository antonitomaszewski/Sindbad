import { Request, Response } from 'express';
import { users } from '../data/users';
import { User } from '../types';

export const registerUser = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email i hasło są wymagane.' });
        return;
    }

    const userExists = users.some((user: User) => user.email === email);
    if (userExists) {
        res.status(409).json({ message: 'Użytkownik o tym e-mailu już istnieje.' });
        return;
    }

    users.push({ email, password });
    res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie.' });
    return;
};


export const loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email i hasło są wymagane.' });
        return;
    }

    const user = users.find((user: User) => user.email === email && user.password === password);
    if (!user) {
        res.status(401).json({ message: 'Nieprawidłowy email lub hasło.' });
        return;
    }

    res.status(200).json({ message: 'Zalogowano pomyślnie.' });
    return;
};
