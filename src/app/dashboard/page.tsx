'use client';

import { useFenceStatus, Status } from '@/hooks/use-fence-status';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, ShieldAlert, Activity, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const StatusDisplay = ({ status }: { status: Status }) => {
  const isLegal = status === 'LEGAL';
  const isIllegal = status === 'ILLEGAL';
  const isDetecting = status === 'DETECTING';
  const isNotDetected = status === 'NOT_DETECTED';
  const isLoading = status === 'LOADING';

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
            <CardTitle>Fence Status</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center p-8 rounded-lg bg-muted animate-pulse">
                <Skeleton className="h-10 w-3/4 mx-auto" />
            </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isDetecting) {
    return (
        <Card
        className={cn(
          'w-full text-center transition-colors duration-500 border-primary bg-primary/20'
        )}
      >
          <CardHeader>
               <CardTitle className="flex items-center justify-center gap-2">
                  <Activity className="text-primary" />
                  Detecting Fence Status
              </CardTitle>
          </CardHeader>
        <CardContent>
          <div
              className={cn(
                  'p-4 rounded-lg bg-primary/30 text-primary-foreground'
              )}
          >
              <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-wider">
                  Please Wait
              </h2>
              <p className="text-sm mt-2 text-primary-foreground/80">Monitoring electrical pulses and sensor data to determine the current fence state. This may take a moment.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isNotDetected) {
    return (
        <Card
        className={cn(
          'w-full text-center transition-colors duration-500 border-muted-foreground bg-muted/50'
        )}
      >
          <CardHeader>
               <CardTitle className="flex items-center justify-center gap-2">
                  <WifiOff className="text-muted-foreground" />
                  Fence Not Detected
              </CardTitle>
          </CardHeader>
        <CardContent>
          <div
              className={cn(
                  'p-4 rounded-lg bg-muted/80 text-foreground'
              )}
          >
              <h2 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-wider">
                  Connection Lost
              </h2>
              <p className="text-sm mt-2 text-foreground/80">Could not establish a connection with the fence monitoring hardware. Please check the device and network connection.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'w-full text-center transition-colors duration-500',
        isLegal ? 'bg-accent/20 border-accent' : 'bg-destructive/20 border-destructive'
      )}
    >
        <CardHeader>
             <CardTitle className="flex items-center justify-center gap-2">
                {isLegal ? <ShieldCheck className="text-accent" /> : <ShieldAlert className="text-destructive" />}
                Fence Status
            </CardTitle>
        </CardHeader>
      <CardContent>
        <div
            className={cn(
                'p-4 rounded-lg',
                isLegal ? 'bg-accent/30 text-accent-foreground' : 'bg-destructive/30 text-destructive-foreground'
            )}
        >
            <h2 className="font-headline text-3xl sm:text-4xl font-bold uppercase tracking-wider">
                {isLegal ? 'Fence is Legal' : 'Tampering Detected!'}
            </h2>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const { status } = useFenceStatus();

  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="font-headline text-2xl sm:text-4xl font-bold uppercase text-primary">
                Electric Fence Monitoring System
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="lg:col-span-3">
                    <StatusDisplay status={status} />
                </div>
            </div>


            <Button variant="link" asChild className="mt-8 mx-auto flex">
                <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
        </div>
    </main>
  );
}
