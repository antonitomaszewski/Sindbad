import { useState, useEffect } from 'react';
import { getUser, getUserCertifications } from '@/logic/lib/users';

export function useUser(userId: string | null) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await getUser(userId);
        setUser(user)
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading };
}