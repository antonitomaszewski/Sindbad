import { User } from '../models/User';

export class UserService {
    private users: User[] = [];

    public createUser(userData: Partial<User>): User {
        const newUser = new User(userData);
        this.users.push(newUser);
        return newUser;
    }

    public getUserById(userId: string): User | undefined {
        return this.users.find(user => user.id === userId);
    }

    public updateUser(userId: string, updatedData: Partial<User>): User | undefined {
        const user = this.getUserById(userId);
        if (user) {
            Object.assign(user, updatedData);
            return user;
        }
        return undefined;
    }

    public deleteUser(userId: string): boolean {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    }

    public getAllUsers(): User[] {
        return this.users;
    }
}