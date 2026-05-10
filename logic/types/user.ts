export interface User {
  id: string;
  password?: string;
  tokenKey?: string;
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
  // optional / new fields used by profile UI
  bio?: string;
  certifications?: string[];
  profile_visibility?: 'public' | 'private';
}