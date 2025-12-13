'use client';

import { useFenceStatus } from '@/hooks/use-fence-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, AlertTriangle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminPage() {
  const { status, sensorData, setFenceStatus } = useFenceStatus();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Fence Control Panel</CardTitle>
          <CardDescription className="text-center">Actively set the electric fence status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-4 p-4 rounded-lg bg-muted">
            <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
            {status === 'LOADING' ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full',
                    status === 'LEGAL' ? 'bg-accent' : 'bg-destructive'
                  )}
                />
                <span className="font-bold text-lg font-headline">{status}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="h-16 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setFenceStatus('LEGAL')}
              disabled={status === 'LOADING'}
            >
              <Lock className="mr-2 h-6 w-6" />
              Set Legal
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="h-16 text-lg"
              onClick={() => setFenceStatus('ILLEGAL')}
              disabled={status === 'LOADING'}
            >
              <AlertTriangle className="mr-2 h-6 w-6" />
              Set Illegal
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground border-t pt-4">
          <p className="font-bold">Static Sensor Info:</p>
          <p>{sensorData}</p>
        </CardFooter>
      </Card>
      <Button variant="link" asChild className="mt-8">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </main>
  );
}
