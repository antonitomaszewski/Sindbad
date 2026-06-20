import { useState, useEffect } from 'react';
import { getUser } from '@/logic/lib/users';

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
        const userData = await getUser(userId);
        setUser(userData);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading };
}