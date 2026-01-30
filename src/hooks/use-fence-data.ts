'use client';

import { useState, useEffect } from 'react';
import { useDatabase } from '@/firebase';
import { ref, onValue, update } from 'firebase/database';

export type FenceStatusValue = 'LEGAL' | 'ILLEGAL_NO_PULSE' | 'ILLEGAL_HIGH_PULSE' | 'DETECTING' | 'NO_FENCE';

export interface RealtimeData {
  status: FenceStatusValue;
  source: string;
  gas: number;
}

interface RtdbRoot {
  fence?: {
    status: FenceStatusValue;
    source: string;
  };
  sensors?: {
    gas: number;
  };
}

export function useFenceData() {
  const db = useDatabase();
  const [data, setData] = useState<RealtimeData>({ status: 'DETECTING', source: 'web', gas: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      return;
    }

    setIsLoading(true);
    const rootRef = ref(db, '/');

    const unsubscribe = onValue(rootRef, (snapshot) => {
      const rootData = snapshot.val() as RtdbRoot | null;
      // Merge received data with defaults to ensure a complete object
      setData(prevData => ({
          status: rootData?.fence?.status ?? prevData.status,
          source: rootData?.fence?.source ?? prevData.source,
          gas: rootData?.sensors?.gas ?? prevData.gas,
      }));
      setIsLoading(false);
    }, (error) => {
        console.error("Firebase Realtime Database read failed:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const setFenceStateByAdmin = (newStatus: FenceStatusValue) => {
    if (db) {
      const fenceRef = ref(db, 'fence');
      update(fenceRef, {
        status: newStatus,
        source: 'web',
      });
    }
  };
  
  return { data, isLoading, setFenceStateByAdmin };
}
