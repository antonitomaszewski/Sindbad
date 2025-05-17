import { User } from '../models/User';
import { Organizer } from '../models/Organizer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    private users: User[] = [];
    private organizers: Organizer[] = [];
    private jwtSecret: string = process.env.JWT_SECRET || 'your_jwt_secret';

    async registerUser(email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(email, hashedPassword);
        this.users.push(newUser);
        return newUser;
    }

    async loginUser(email: string, password: string): Promise<string | null> {
        const user = this.users.find(user => user.email === email);
        if (user && await bcrypt.compare(password, user.password)) {
            return this.generateToken(user);
        }
        return null;
    }

    async registerOrganizer(email: string, password: string): Promise<Organizer> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOrganizer = new Organizer(email, hashedPassword);
        this.organizers.push(newOrganizer);
        return newOrganizer;
    }

    async loginOrganizer(email: string, password: string): Promise<string | null> {
        const organizer = this.organizers.find(org => org.email === email);
        if (organizer && await bcrypt.compare(password, organizer.password)) {
            return this.generateToken(organizer);
        }
        return null;
    }

    private generateToken(user: User | Organizer): string {
        return jwt.sign({ id: user.id, email: user.email }, this.jwtSecret, { expiresIn: '1h' });
    }
}