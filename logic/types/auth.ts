export interface AuthResponse {
  token: string;
  record: any;
}

export type OAuthProvider = 'google' | 'facebook' | 'github';