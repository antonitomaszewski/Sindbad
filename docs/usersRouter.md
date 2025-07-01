import pb from './pocketbase';
import { User } from '../types/user';

// Pobierz dane usera po ID
export async function getUser(id: string): Promise<User | null> {
  try {
    const record = await pb.collection('users').getOne(id);
    return record as User;
  } catch (error) {
    return null;
  }
}