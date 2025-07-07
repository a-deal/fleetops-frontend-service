import { TelemetryDashboard } from '@/components/telemetry-dashboard';
import { TelemetryProvider } from '@/providers/telemetry-provider';

export default function TelemetryPage() {
  return (
    <TelemetryProvider autoConnect={false}>
      <TelemetryDashboard />
    </TelemetryProvider>
  );
}