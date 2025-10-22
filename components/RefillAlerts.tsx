'use client';

import { useRefills } from '@/lib/hooks/useMedications';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@/lib/calculations';

export default function RefillAlerts() {
  const { data: refills, isLoading } = useRefills();

  if (isLoading || !refills || refills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Refill Alerts</h3>
      {refills.map((status) => (
        <Alert
          key={status.medication.id}
          variant={status.status === 'overdue' ? 'destructive' : 'default'}
        >
          <AlertDescription>
            <strong>{status.medication.name}</strong> -{' '}
            {status.status === 'overdue'
              ? 'Refill overdue!'
              : `Refill needed by ${formatDate(status.refillDate)}`}
            {' '}
            ({status.daysRemaining} days remaining)
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
