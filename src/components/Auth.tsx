'use client';

import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useEffect } from 'react';

export default function Auth({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return <>{children}</>;
}
