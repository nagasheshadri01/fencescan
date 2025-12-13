'use client';

import { useMemo } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export type FenceStatusValue = 'LEGAL' | 'ILLEGAL_NO_PULSE' | 'ILLEGAL_HIGH_PULSE' | 'DETECTING' | 'NOT_DETECTED';
type LoadingStatus = 'LOADING';
export type Status = FenceStatusValue | LoadingStatus;

interface FenceStatusDoc {
  status: FenceStatusValue;
  lastUpdated: string;
}

export function useFenceStatus() {
  const firestore = useFirestore();

  const fenceStatusRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'fence_status/latest');
  }, [firestore]);

  const { data: fenceStatusDoc, isLoading: isFenceStatusLoading } = useDoc<FenceStatusDoc>(fenceStatusRef);

  const status: Status = isFenceStatusLoading ? 'LOADING' : fenceStatusDoc?.status || 'DETECTING';

  const setFenceStatus = (newStatus: FenceStatusValue) => {
    if (firestore) {
      const docRef = doc(firestore, 'fence_status/latest');
      const dataToSet = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      };
      setDoc(docRef, dataToSet, { merge: true });
    }
  };

  return { status, setFenceStatus };
}
