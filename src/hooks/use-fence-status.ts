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
  pulseValue: string;
}

export function useFenceStatus() {
  const firestore = useFirestore();

  const fenceStatusRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'fence_status/latest');
  }, [firestore]);

  const { data: fenceStatusDoc, isLoading: isFenceStatusLoading } = useDoc<FenceStatusDoc>(fenceStatusRef);

  const status: Status = isFenceStatusLoading ? 'LOADING' : fenceStatusDoc?.status || 'DETECTING';
  const pulseValue = isFenceStatusLoading || !fenceStatusDoc ? '---' : fenceStatusDoc.pulseValue;

  const setFenceStatus = (newStatus: FenceStatusValue) => {
    if (firestore) {
      const docRef = doc(firestore, 'fence_status/latest');
      const newPulseValue = {
        LEGAL: '1.2 pulses/sec',
        ILLEGAL_NO_PULSE: '0 pulses/sec',
        ILLEGAL_HIGH_PULSE: '3.5 pulses/sec',
        NOT_DETECTED: '---',
        DETECTING: '---',
      }[newStatus];

      const dataToSet = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        pulseValue: newPulseValue,
      };
      // This is a non-blocking write. The UI will update via the real-time listener.
      setDoc(docRef, dataToSet, { merge: true });
    }
  };

  return { status, pulseValue, setFenceStatus };
}
