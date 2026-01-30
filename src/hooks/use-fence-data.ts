'use client';

import { useState, useEffect } from 'react';
import { useDatabase, useUser } from '@/firebase';
import { ref, onValue, set, serverTimestamp } from 'firebase/database';

export type FenceStatusValue = 'LEGAL' | 'ILLEGAL_NO_PULSE' | 'ILLEGAL_HIGH_PULSE' | 'DETECTING' | 'NO_FENCE';
export type Source = 'ADMIN' | 'AUTO';

export interface FenceData {
  status: FenceStatusValue;
  source: Source;
  gasValue: number;
  lastUpdated: number;
}

export function useFenceData() {
  const db = useDatabase();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const [data, setData] = useState<FenceData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Wait until we have the db instance and the user is authenticated.
    if (!db || isAuthLoading || !user) {
      setDataLoading(true); // Keep loading until ready
      return;
    }

    const fenceRef = ref(db, 'fence');
    const unsubscribe = onValue(fenceRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        // If no data exists, initialize with default detecting state
        set(fenceRef, {
            status: 'DETECTING',
            source: 'AUTO',
            gasValue: 0,
            lastUpdated: serverTimestamp(),
        });
      }
      setDataLoading(false);
    }, (error) => {
        // Correctly log the Realtime Database error instead of creating a misleading Firestore error.
        console.error("Firebase Realtime Database read failed:", error);
        setDataLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isAuthLoading]);

  const setFenceStateByAdmin = (newStatus: FenceStatusValue) => {
    if (db) {
      const fenceRef = ref(db, 'fence');
      const currentData = data || { gasValue: 0 };
      set(fenceRef, {
        ...currentData,
        status: newStatus,
        source: 'ADMIN',
        lastUpdated: serverTimestamp(),
      });
    }
  };
  
  const releaseToAuto = () => {
      if (db) {
          const fenceRef = ref(db, 'fence');
           const currentData = data || { status: 'DETECTING', gasValue: 0 };
           set(fenceRef, {
            ...currentData,
            source: 'AUTO',
            lastUpdated: serverTimestamp(),
          });
      }
  };

  const isLoading = isAuthLoading || dataLoading;

  return { data, isLoading, setFenceStateByAdmin, releaseToAuto };
}
