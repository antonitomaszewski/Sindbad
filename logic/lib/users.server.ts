import 'server-only';
import { cookies } from 'next/headers';
import pb from './pocketbase';
import type { User } from '../types/user';

export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('pb_auth');

    if (!authCookie) {
      return null;
    }

    pb.authStore.loadFromCookie(authCookie.value);

    if (!pb.authStore.isValid || !pb.authStore.record) {
      return null;
    }

    const record = pb.authStore.record;
    
    return {
      id: record.id,
      password: record.password,
      tokenKey: record.tokenKey,
      email: record.email,
      emailVisibility: record.emailVisibility,
      verified: record.verified,
      name: record.name || '',
      avatar: record.avatar || '',
      created: record.created,
      updated: record.updated,
      bio: record.bio || '',
      certifications: Array.isArray(record.certifications) ? record.certifications : [],
    } as User;
  } catch (error) {
    console.error('getServerUser error:', error);
    return null;
  }
}