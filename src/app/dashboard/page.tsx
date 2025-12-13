'use client';

import { useFenceStatus, Status } from '@/hooks/use-fence-status';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const StatusLED = ({ status }: { status: Status }) => {
  const colorClass = {
    'LEGAL': 'bg-green-500 shadow-[0_0_10px_theme(colors.green.500)]',
    'ILLEGAL': 'bg-red-500 shadow-[0_0_10px_theme(colors.red.500)] animate-pulse',
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
      explanation: 'System reports normal fence pulse behavior. No anomalies detected.',
      className: 'text-green-400',
      glowClass: 'shadow-[0_0_20px_theme(colors.green.900)]',
    },
    ILLEGAL: {
      text: 'FENCE FAULT',
      explanation: 'System reports abnormal fence condition. Possible power loss, wire break, or tampering.',
      className: 'text-red-400 animate-pulse',
      glowClass: 'shadow-[0_0_20px_theme(colors.red.900)]',
    },
    NOT_DETECTED: {
      text: 'NO FENCE DETECTED',
      explanation: 'No fence signal detected. Fence may be offline or disconnected.',
      className: 'text-amber-400',
      glowClass: 'shadow-[0_0_20px_theme(colors.amber.900)]',
    },
    DETECTING: {
      text: 'DETECTING...',
      explanation: 'Calibrating sensors and monitoring electrical pulses to determine fence state.',
      className: 'text-blue-400 animate-pulse',
      glowClass: 'shadow-[0_0_20px_theme(colors.blue.900)]',
    },
    LOADING: {
      text: 'CONNECTING...',
      explanation: 'Establishing connection to monitoring system...',
      className: 'text-gray-400',
      glowClass: 'shadow-[0_0_20px_theme(colors.gray.900)]',
    },
  };

  const current = statusConfig[status];

  return (
    <Card className={cn('text-center transition-all duration-500 border-border/50', current.glowClass)}>
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

const AnalyticalCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
  <Card className="border-border/30">
    <CardHeader>
      <CardTitle className="text-md font-medium text-muted-foreground">{title}</CardTitle>
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
    ILLEGAL: 35,
    NOT_DETECTED: 0,
    DETECTING: 50,
    LOADING: 0,
  }[status];

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-md font-medium text-muted-foreground">System Confidence Level</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-foreground">{confidence}%</p>
        <Progress value={confidence} className="mt-2 h-2" />
        <p className="text-sm text-muted-foreground mt-2">Calculated from simulated pulse consistency</p>
      </CardContent>
    </Card>
  );
};

const DiagnosisCard = ({ status }: { status: Status }) => {
  const diagnosis = {
    LEGAL: 'Fence energizer operating within expected parameters.',
    ILLEGAL: 'Pulse anomaly detected. System integrity compromised.',
    NOT_DETECTED: 'Fence signal unavailable. Verification required.',
    DETECTING: 'Analysis in progress.',
    LOADING: 'Awaiting data...',
  }[status];

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-md font-medium text-muted-foreground">Automated Diagnosis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground">{diagnosis}</p>
      </CardContent>
    </Card>
  );
};

const EventTimeline = ({ newStatus }: { newStatus: Status }) => {
  const [events, setEvents] = useState<string[]>([]);
  const [prevStatus, setPrevStatus] = useState<Status|null>(null);
  
  useEffect(() => {
    if (newStatus !== 'LOADING' && newStatus !== prevStatus) {
      const timestamp = new Date().toLocaleTimeString();
      let eventMessage = '';
      switch(newStatus) {
        case 'LEGAL': eventMessage = 'Fence status set to LIVE'; break;
        case 'ILLEGAL': eventMessage = 'Status changed to FAULT'; break;
        case 'NOT_DETECTED': eventMessage = 'Fence signal unavailable'; break;
        case 'DETECTING': eventMessage = 'System reset to DETECTING'; break;
        default: return;
      }
      setEvents(prev => [`${timestamp} - ${eventMessage}`, ...prev].slice(0, 5));
      setPrevStatus(newStatus);
    }
  }, [newStatus, prevStatus]);

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-md font-medium text-muted-foreground">Event Timeline</CardTitle>
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

export default function DashboardPage() {
  const { status } = useFenceStatus();

  const pulseValue = {
    LEGAL: '1.2 pulses/sec',
    ILLEGAL: '0.1 pulses/sec',
    NOT_DETECTED: '---',
    DETECTING: '---',
    LOADING: '---',
  }[status];

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
                Real-time status visualization | System heartbeat active
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <PrimaryStatusPanel status={status} />
          </div>

          <AnalyticalCard 
            title="Pulse Activity Analysis"
            value={pulseValue}
            subtitle="Expected operating range: 1-2 pulses/sec"
          />
          <DiagnosisCard status={status} />
          <ConfidenceCard status={status} />
          
          <div className="lg:col-span-3">
            <EventTimeline newStatus={status} />
          </div>

        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          System synchronized with central database
        </footer>
      </div>
    </main>
  );
}
