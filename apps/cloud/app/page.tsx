import { cn } from '@repo/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">FleetOps Cloud Service</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Cloud-based fleet management platform
        </p>
        <div className="space-y-4">
          <div className={cn("p-6 bg-card rounded-lg border")}>
            <h2 className="text-xl font-semibold mb-2">Architecture</h2>
            <p className="text-sm text-muted-foreground">
              Connects to AWS IoT Core for real-time fleet telemetry
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Status</h2>
            <p className="text-sm text-muted-foreground">
              Service initialization in progress
            </p>
          </div>
          <Link
            href="/telemetry"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Open Telemetry Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}