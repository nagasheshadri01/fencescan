'use client';

import { useFenceStatus } from '@/hooks/use-fence-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertTriangle, WifiOff, RefreshCw, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { status, setFenceStatus } = useFenceStatus();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center text-primary">Admin Control Panel</CardTitle>
          <CardDescription className="text-center">System Simulation Interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground text-sm">
            These controls simulate real fence conditions for testing and demonstration.
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Button
              size="lg"
              className="h-16 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setFenceStatus('LEGAL')}
              disabled={status === 'LOADING'}
            >
              <CheckCircle className="mr-2 h-6 w-6" />
              Simulate Normal Fence
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="h-16 text-lg"
              onClick={() => setFenceStatus('ILLEGAL')}
              disabled={status === 'LOADING'}
            >
              <AlertTriangle className="mr-2 h-6 w-6" />
              Simulate Fault / Illegal
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-16 text-lg bg-amber-500 text-black hover:bg-amber-600"
              onClick={() => setFenceStatus('NOT_DETECTED')}
              disabled={status === 'LOADING'}
            >
              <WifiOff className="mr-2 h-6 w-6" />
              Simulate No Fence
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 text-lg"
              onClick={() => setFenceStatus('DETECTING')}
              disabled={status === 'LOADING'}
            >
              <RefreshCw className="mr-2 h-6 w-6" />
              Reset to Detecting
            </Button>
          </div>
        </CardContent>
         <CardFooter className="flex justify-center">
            {status === 'LOADING' ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <div className="text-muted-foreground">
                Current State: <span className="font-bold text-foreground">{status}</span>
              </div>
            )}
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
