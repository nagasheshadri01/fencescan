'use client';

import { useFenceData, FenceStatusValue } from '@/hooks/use-fence-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Wind, Zap } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

type Status = FenceStatusValue | 'LOADING';


const StatusLED = ({ status }: { status: Status }) => {
  const colorClass = useMemo(() => ({
    'LEGAL': 'bg-green-500 shadow-[0_0_10px_theme(colors.green.500)] animate-pulse',
    'ILLEGAL_NO_PULSE': 'bg-red-500 shadow-[0_0_10px_theme(colors.red.500)] animate-pulse',
    'ILLEGAL_HIGH_PULSE': 'bg-red-500 shadow-[0_0_10px_theme(colors.red.500)] animate-pulse',
    'NO_FENCE': 'bg-amber-500 shadow-[0_0_10px_theme(colors.amber.500)]',
    'DETECTING': 'bg-blue-500 shadow-[0_0_10px_theme(colors.blue.500)] animate-pulse',
    'LOADING': 'bg-gray-500',
  }[status]), [status]);

  return <div className={cn('w-3 h-3 rounded-full transition-all', colorClass)} />;
};

const PrimaryStatusPanel = ({ status }: { status: Status }) => {
  const statusConfig = useMemo(() => ({
    LEGAL: {
      text: 'Normal Fence Detected',
      explanation: 'Normal fence operation detected. Pulse rate within expected range.',
      className: 'text-green-400',
      bgClassName: 'bg-green-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.green.900)]',
    },
    ILLEGAL_NO_PULSE: {
      text: 'Illegal Fence – No Pulse',
      explanation: 'No fence pulse detected. Possible power failure, wire break, or energizer fault.',
      className: 'text-red-400 animate-pulse',
      bgClassName: 'bg-red-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.red.900)]',
    },
    ILLEGAL_HIGH_PULSE: {
        text: 'Illegal Fence – High Pulse',
        explanation: 'Abnormally high pulse rate detected. Possible short circuit, grounding issue, or active tampering.',
        className: 'text-red-400 animate-pulse',
        bgClassName: 'bg-red-900/20',
        glowClass: 'shadow-[0_0_20px_theme(colors.red.900)]',
    },
    NO_FENCE: {
      text: 'No Fence Detected',
      explanation: 'Fence signal unavailable. Fence may be disconnected or system is offline.',
      className: 'text-amber-400',
      bgClassName: 'bg-amber-900/20',
      glowClass: 'shadow-[0_0_20px_theme(colors.amber.900)]',
    },
    DETECTING: {
      text: 'Detecting…',
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
  }), []);

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

const EventLog = ({ newStatus }: { newStatus: Status }) => {
    const [events, setEvents] = useState<string[]>([]);
    const [prevStatus, setPrevStatus] = useState<Status | null>(null);
  
    const pulseValueMap: Record<FenceStatusValue, string> = {
      LEGAL: '1.2 pulses/sec',
      ILLEGAL_NO_PULSE: '0 pulses/sec',
      ILLEGAL_HIGH_PULSE: '3.5 pulses/sec',
      NO_FENCE: '---',
      DETECTING: '---',
    };
  
    const statusMessageMap: Record<FenceStatusValue, string> = {
      LEGAL: 'Fence pulse detected. System operating normally.',
      ILLEGAL_NO_PULSE: 'Fence pulse lost. Monitoring indicates possible power failure.',
      ILLEGAL_HIGH_PULSE: 'High-frequency pulse anomaly detected.',
      NO_FENCE: 'Fence signal unavailable.',
      DETECTING: 'System reset. Monitoring for fence pulse...',
    };
  
    useEffect(() => {
      if (newStatus !== 'LOADING' && newStatus !== prevStatus) {
        const timestamp = new Date().toLocaleTimeString();
        const pulseValue = pulseValueMap[newStatus as FenceStatusValue] || '---';
        const eventMessage = statusMessageMap[newStatus as FenceStatusValue] || 'Unknown event.';
  
        setEvents((prev) => [`${timestamp} - ${eventMessage} (Pulse: ${pulseValue})`, ...prev].slice(0, 5));
        setPrevStatus(newStatus);
      }
    }, [newStatus, prevStatus]);
  
    return (
      <Card className="border-border/30 bg-card/80">
        <CardHeader>
          <CardTitle className="text-md font-medium text-muted-foreground">System Event Log</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {events.map((event, index) => (
                <li key={index} className="text-muted-foreground font-mono">
                  {event}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Awaiting system events...</p>
          )}
        </CardContent>
      </Card>
    );
  };

export default function Dashboard1Page() {
  const { data, isLoading } = useFenceData();

  const status: Status = isLoading ? 'LOADING' : data.status ?? 'DETECTING';
  
  const pulseValue = useMemo(() => ({
    LEGAL: '1.2 pulses/sec',
    ILLEGAL_NO_PULSE: '0 pulses/sec',
    ILLEGAL_HIGH_PULSE: '3.5 pulses/sec',
    NO_FENCE: '---',
    DETECTING: '---',
    LOADING: '---',
  }[status]), [status]);

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
            title="Gas Sensor"
            value={isLoading ? '...' : `${data.gas ?? 'N/A'} PPM`}
            subtitle="Anomalies will be flagged"
            icon={<Wind className="h-4 w-4 text-muted-foreground" />}
          />
          <AnalyticalCard 
            title="Pulse Activity"
            value={pulseValue}
            subtitle="Expected: ~1.2 pulses/sec"
            icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          />
          <div className="md:col-span-2">
            <EventLog newStatus={status} />
          </div>
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <div>Monitoring system synchronized via Realtime Database</div>
        </footer>
      </div>
    </main>
  );
}
