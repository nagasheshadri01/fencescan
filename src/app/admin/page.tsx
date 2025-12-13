'use client';

import { useFenceStatus, FenceStatusValue } from '@/hooks/use-fence-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, WifiOff, RefreshCw, ChevronLeft, ZapOff, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { status, setFenceStatus } = useFenceStatus();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center text-primary">Admin Control Panel</CardTitle>
          <CardDescription className="text-center">Fence Condition Simulator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground text-sm px-4">
            These controls simulate real fence conditions for testing, demonstration, and evaluation.
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
              onClick={() => setFenceStatus('ILLEGAL_NO_PULSE')}
              disabled={status === 'LOADING'}
            >
              <ZapOff className="mr-2 h-6 w-6" />
              Simulate Illegal - No Pulse
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="h-16 text-lg"
              onClick={() => setFenceStatus('ILLEGAL_HIGH_PULSE')}
              disabled={status === 'LOADING'}
            >
              <Zap className="mr-2 h-6 w-6" />
             Simulate Illegal - High Pulse
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-16 text-lg bg-amber-500 text-black hover:bg-amber-600"
              onClick={() => setFenceStatus('NOT_DETECTED')}
              disabled={status === 'LOADING'}
            >
              <WifiOff className="mr-2 h-6 w-6" />
              Simulate No Fence Detected
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
         <CardFooter className="flex justify-center pt-4">
            <div className="text-muted-foreground">
              Current State: <span className="font-bold text-foreground">{status}</span>
            </div>
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
