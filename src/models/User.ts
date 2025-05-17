import { User } from '../types/index';

export class UserModel implements User {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}