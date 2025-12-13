'use client';

import { useFenceStatus, Status } from '@/hooks/use-fence-status';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const StatusDisplay = ({ status }: { status: Status }) => {
  const isLegal = status === 'LEGAL';
  const isLoading = status === 'LOADING';

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl p-8 sm:p-16 rounded-lg shadow-2xl bg-muted animate-pulse">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full max-w-4xl p-8 sm:p-16 rounded-lg shadow-2xl text-center transition-colors duration-500',
        isLegal ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'
      )}
    >
      <h2 className="font-headline text-4xl sm:text-6xl font-bold uppercase tracking-wider">
        {isLegal ? 'Fence is Legal' : 'Tampering Detected!'}
      </h2>
    </div>
  );
};

export default function DashboardPage() {
  const { status, sensorData } = useFenceStatus();

  return (
    <main className="bg-zinc-800 text-zinc-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl sm:text-5xl font-bold uppercase text-zinc-300">
          Electric Fence Monitoring System
        </h1>
      </div>

      <StatusDisplay status={status} />

      <div className="mt-8 text-center text-zinc-400">
        <p className="font-bold">Pre-set Sensor Status:</p>
         <p>{sensorData ? `Temp: ${sensorData.temperature} - Smoke: ${sensorData.smokeDetected ? 'Yes' : 'No'}` : 'Loading...'}</p>
      </div>

      <Button variant="link" asChild className="mt-8 text-zinc-300 hover:text-zinc-50">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </main>
  );
}
