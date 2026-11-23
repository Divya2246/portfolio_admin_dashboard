import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges, signOut as authSignOut } from '../firebase/services/auth.service';

export function useAuth(): { user: User | null; signOut: () => Promise<void>; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, []);

  const signOut = async () => {
    await authSignOut();
  };

  return { user, signOut, loading };
}
