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
}