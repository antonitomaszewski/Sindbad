export type OAuthProvider = | 'google' ;

export interface OAuthButtonProps {
  provider: 'google';
  onSuccess: () => void;
  onError: (error: string) => void;
}
