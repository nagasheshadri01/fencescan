"use client";

import { useMemo } from 'react';
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

type FenceStatusValue = 'LEGAL' | 'ILLEGAL';
type LoadingStatus = 'LOADING';
export type Status = FenceStatusValue | LoadingStatus;

interface FenceStatusDoc {
    status: FenceStatusValue;
    lastUpdated: string;
}

interface SensorDataDoc {
    temperature: string;
    smokeDetected: boolean;
    lastRead: string;
}

export function useFenceStatus() {
  const firestore = useFirestore();

  const fenceStatusRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'fence_status/latest');
  }, [firestore]);

  const sensorDataRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'sensor_data/static');
  }, [firestore]);

  const { data: fenceStatusDoc, isLoading: isFenceStatusLoading } = useDoc<FenceStatusDoc>(fenceStatusRef);
  const { data: sensorDataDoc, isLoading: isSensorDataLoading } = useDoc<SensorDataDoc>(sensorDataRef);
  
  const status: Status = isFenceStatusLoading ? 'LOADING' : (fenceStatusDoc?.status || 'ILLEGAL');
  
  const setFenceStatus = (newStatus: FenceStatusValue) => {
    if (firestore) {
      const docRef = doc(firestore, 'fence_status/latest');
      const dataToSet = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      };
      setDocumentNonBlocking(docRef, dataToSet, { merge: true });
    }
  };

  const sensorData = useMemo(() => {
    if (isSensorDataLoading || !sensorDataDoc) {
        return null;
    }
    return {
        temperature: sensorDataDoc.temperature,
        smokeDetected: sensorDataDoc.smokeDetected,
    };
  }, [sensorDataDoc, isSensorDataLoading]);

  return { status, sensorData, setFenceStatus };
}
