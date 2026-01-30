'use client';

import { useFenceStatus, Status } from '@/hooks/use-fence-status';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { Activity, Wind, RefreshCw } from 'lucide-react';

interface EventDoc {
  message: string;
  timestamp: any;
}

interface SensorDataDoc {
  gasValue: number;
  lastRead: any;
}

function useSensorData() {
    const firestore = useFirestore();

    const sensorDataRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'sensor_data/latest');
    }, [firestore]);

    const { data: sensorData, isLoading, error } = useDoc<SensorDataDoc>(sensorDataRef);

    const refreshSensorData = () => {
        if(firestore) {
            const requestRef = doc(firestore, 'sensor_requests/latest');
            setDoc(requestRef, { requestedAt: new Date().toISOString() });
        }
    };
    
    return { sensorData, isLoading, error, refreshSensorData };
}


const StatusLED = ({ status }: { status: Status }) => {
  const colorClass = {
    'LEGAL': 'bg-green-500 shadow-[0_0_10px_theme(colors.green.500)] animate-pulse',
    'ILLEGAL_NO_PULSE': 'bg-red-500 shadow-[0_0_10px_theme(colors.red.500)] animate-pulse',
    'ILLEGAL_HIGH_PULSE': 'bg-red-500 shadow-[0_0_10px_theme(colors.red.500)] animate-pulse',
    'NOT_DETECTED': 'bg-amber-500 shadow-[0_0_10px_theme(colors.amber.500)]',
    'DETECTING': 'bg-blue-500 shadow-[0_0_10px_theme(colors.blue.500)] animate-pulse',
    'LOADING': 'bg-gray-500',
  }[status];

  return <div className={cn('w-3 h-3 rounded-full transition-all', colorClass)} />;
};

const PrimaryStatusPanel = ({ status }: { status: Status }) => {
  const statusConfig = {
    LEGAL: {
      text: 'FENCE LIVE',
      explanation: 'Normal fence operation detected. Pulse rate within expected range.',
      className: 'text-green-400',
      bgClassName: 'bg-green-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.green.900)]',
    },
    ILLEGAL_NO_PULSE: {
      text: 'ILLEGAL – NO PULSE',
      explanation: 'No fence pulse detected. Possible power failure, wire break, or energizer fault.',
      className: 'text-red-400 animate-pulse',
      bgClassName: 'bg-red-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.red.900)]',
    },
    ILLEGAL_HIGH_PULSE: {
        text: 'ILLEGAL – HIGH PULSE RATE',
        explanation: 'Abnormally high pulse rate detected. Possible short circuit, grounding issue, or active tampering.',
        className: 'text-red-400 animate-pulse',
        bgClassName: 'bg-red-900/20',
        glowClass: 'shadow-[0_0_20px_theme(colors.red.900)]',
    },
    NOT_DETECTED: {
      text: 'NO FENCE DETECTED',
      explanation: 'Fence signal unavailable. Fence may be disconnected or system is offline.',
      className: 'text-amber-400',
      bgClassName: 'bg-amber-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.amber.900)]',
    },
    DETECTING: {
      text: 'DETECTING...',
      explanation: 'Calibrating sensors and monitoring electrical pulses to determine fence state.',
      className: 'text-blue-400 animate-pulse',
      bgClassName: 'bg-blue-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.blue.900)]',
    },
    LOADING: {
      text: 'CONNECTING...',
      explanation: 'Establishing connection to monitoring system...',
      className: 'text-gray-400',
      bgClassName: 'bg-gray-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.gray.900)]',
    },
  };

  const current = statusConfig[status];

  return (
    <Card className={cn('text-center transition-all duration-500 border-border/50', current.bgClassName, current.glowClass)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-muted-foreground">Fence Operational Status</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className={cn('font-headline text-5xl font-bold tracking-wider', current.className)}>
          {current.text}
        </h2>
        <p className="mt-4 text-muted-foreground">{current.explanation}</p>
      </CardContent>
    </Card>
  );
};

const AnalyticalCard = ({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon?: React.ReactNode }) => (
  <Card className="border-border/30 bg-card/80">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const ConfidenceCard = ({ status }: { status: Status }) => {
  const confidence = {
    LEGAL: 98,
    ILLEGAL_NO_PULSE: 25,
    ILLEGAL_HIGH_PULSE: 42,
    NOT_DETECTED: 0,
    DETECTING: 50,
    LOADING: 0,
  }[status];

  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-md font-medium text-muted-foreground">System Confidence Level</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-foreground">{confidence}%</p>
        <Progress value={confidence} className="mt-2 h-2" />
        <p className="text-sm text-muted-foreground mt-2">Derived from simulated pulse stability</p>
      </CardContent>
    </Card>
  );
};

const DiagnosisCard = ({ status }: { status: Status }) => {
  const diagnosis = {
    LEGAL: 'Fence energizer operating within expected parameters.',
    ILLEGAL_NO_PULSE: 'Fence pulse absent. System integrity compromised.',
    ILLEGAL_HIGH_PULSE: 'Pulse anomaly detected. Fence may be shorted or under interference.',
    NOT_DETECTED: 'No diagnosable fence signal available.',
    DETECTING: 'Analysis in progress.',
    LOADING: 'Awaiting data...',
  }[status];

  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-md font-medium text-muted-foreground">System Diagnosis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground">{diagnosis}</p>
      </CardContent>
    </Card>
  );
};

const EventTimeline = () => {
  const firestore = useFirestore();
  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('timestamp', 'desc'), limit(5));
  }, [firestore]);

  const { data: events, isLoading } = useCollection<EventDoc>(eventsQuery);

  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-md font-medium text-muted-foreground">System Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading events...</p>}
        {!isLoading && (!events || events.length === 0) ? (
          <p className="text-muted-foreground">Awaiting system events...</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {events?.map((event) => (
              <li key={event.id} className="text-muted-foreground font-mono">
                {event.timestamp.toDate().toLocaleTimeString()} - {event.message}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard1Page() {
  const { status, pulseValue } = useFenceStatus();
  const { sensorData, isLoading: isSensorLoading, refreshSensorData } = useSensorData();

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <StatusLED status={status} />
            <div>
              <h1 className="font-headline text-3xl font-bold text-foreground">
                Electric Fence Monitoring System
              </h1>
              <p className="text-sm text-muted-foreground">
                Live fence diagnostics | Continuous monitoring active
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <PrimaryStatusPanel status={status} />
          </div>

          <AnalyticalCard 
            title="Pulse Activity"
            value={pulseValue}
            subtitle="Expected operating range: 1-2 pulses/sec"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          />
          <AnalyticalCard 
            title="Gas Sensor"
            value={isSensorLoading ? '...' : `${sensorData?.gasValue ?? 'N/A'} PPM`}
            subtitle="Anomalies will be flagged"
            icon={<Wind className="h-4 w-4 text-muted-foreground" />}
          />
          
          <DiagnosisCard status={status} />
          <ConfidenceCard status={status} />
          
          <div className="md:col-span-2">
            <EventTimeline />
          </div>

        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <Button onClick={refreshSensorData} disabled={isSensorLoading} variant="outline" className="mb-4">
            <RefreshCw className={`mr-2 h-4 w-4 ${isSensorLoading ? 'animate-spin' : ''}`} />
            Refresh Sensor Data
          </Button>
          <div>Monitoring system synchronized</div>
        </footer>
      </div>
    </main>
  );
}
