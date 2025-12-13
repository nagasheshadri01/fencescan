'use client';

import { useFenceStatus, Status } from '@/hooks/use-fence-status';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, ShieldAlert, Thermometer, Wind, MapPin, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


const StatusDisplay = ({ status }: { status: Status }) => {
  const isLegal = status === 'LEGAL';
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

const SensorCard = ({ sensorData }: { sensorData: { temperature: string; smokeDetected: boolean; } | null }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Thermometer /> Sensor Data</CardTitle>
            <CardDescription>Current environmental readings.</CardDescription>
        </CardHeader>
        <CardContent className="text-lg">
            {sensorData ? (
                <div className="space-y-2">
                    <p><strong>Temperature:</strong> {sensorData.temperature}</p>
                    <p><strong>Smoke Detected:</strong> {sensorData.smokeDetected ? 'Yes' : 'No'}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
            )}
        </CardContent>
    </Card>
);

const FeatureCard = ({ title, icon, description }: { title: string, icon: React.ReactNode, description: string }) => (
    <Card className="bg-muted/50 border-dashed">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">{icon} {title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-muted-foreground flex-col gap-2">
            <Construction className="w-10 h-10" />
            <p className="text-sm font-medium">Coming Soon</p>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const { status, sensorData } = useFenceStatus();

  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="font-headline text-2xl sm:text-4xl font-bold uppercase text-primary">
                Electric Fence Monitoring System
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <StatusDisplay status={status} />
                </div>

                <SensorCard sensorData={sensorData} />

                <FeatureCard 
                    title="Gas Detection"
                    icon={<Wind />}
                    description="Monitoring for harmful gases."
                />

                <FeatureCard 
                    title="GPS Tracking"
                    icon={<MapPin />}
                    description="Real-time fence-line location."
                />
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
