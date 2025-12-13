import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          FenceSync
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Real-Time Electric Fence Monitoring System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="items-center text-center">
            <User className="w-12 h-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">User Dashboard</CardTitle>
            <CardDescription>View the live fence status.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="items-center text-center">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Admin Panel</CardTitle>
            <CardDescription>Control the fence status.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/admin">Go to Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
