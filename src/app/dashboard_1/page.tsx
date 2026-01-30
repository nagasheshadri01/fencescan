'use client';

import { useFenceData, FenceData, FenceStatusValue } from '@/hooks/use-fence-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Activity, Wind, User, Bot } from 'lucide-react';
import { useMemo } from 'react';

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

const SourceCard = ({ source }: { source: 'ADMIN' | 'AUTO' | 'N/A' }) => {
    const icon = source === 'ADMIN' ? <User className="h-4 w-4 text-muted-foreground" /> : <Bot className="h-4 w-4 text-muted-foreground" />;
    const subtitle = source === 'ADMIN' ? 'Manual override active' : 'Real-time device updates';
    
    return (
        <AnalyticalCard
            title="Control Source"
            value={source}
            subtitle={subtitle}
            icon={icon}
        />
    );
}

export default function Dashboard1Page() {
  const { data, isLoading } = useFenceData();

  const status: Status = isLoading ? 'LOADING' : data?.status ?? 'DETECTING';

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
            value={isLoading ? '...' : `${data?.gasValue ?? 'N/A'} PPM`}
            subtitle="Anomalies will be flagged"
            icon={<Wind className="h-4 w-4 text-muted-foreground" />}
          />
          <SourceCard source={isLoading ? 'N/A' : data?.source ?? 'N/A'} />

        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <div>Monitoring system synchronized via Realtime Database</div>
        </footer>
      </div>
    </main>
  );
}
