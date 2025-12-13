"use client";

import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';

type FenceStatus = 'LEGAL' | 'ILLEGAL';
type LoadingStatus = 'LOADING';
export type Status = FenceStatus | LoadingStatus;

export function useFenceStatus() {
  const [status, setStatus] = useState<Status>('LOADING');
  const [sensorData, setSensorData] = useState<string>('Loading sensor data...');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const statusRef = ref(database, 'fence/status');
    const sensorRef = ref(database, 'sensor/temp_smoke');

    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data === 'LEGAL' || data === 'ILLEGAL') {
        setStatus(data);
      } else {
        setStatus('ILLEGAL'); // Default to a safe state if data is invalid or null
      }
    }, (error) => {
        console.error("Firebase status read failed: ", error);
        setStatus('ILLEGAL');
    });

    get(sensorRef).then((snapshot) => {
      if (snapshot.exists()) {
        setSensorData(snapshot.val());
      } else {
        // As per PRD, use a placeholder if not present in DB
        setSensorData("25C - NO SMOKE");
      }
    }).catch((error) => {
      console.error("Firebase sensor read failed: ", error);
      setSensorData('Failed to load sensor data.');
    });

    return () => {
      unsubscribeStatus();
    };
  }, []);

  const setFenceStatus = (newStatus: FenceStatus) => {
    const statusRef = ref(database, 'fence/status');
    set(statusRef, newStatus).catch((error) => {
      console.error('Failed to set fence status:', error);
    });
  };

  return { status, sensorData, setFenceStatus };
}
