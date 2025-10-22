'use client';

import { useMedications } from '@/lib/hooks/useMedications';
import MedicationCard from './MedicationCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MedicationList() {
  const { data: medications, isLoading, error } = useMedications();

  if (isLoading) {
    return <div className="text-center py-8">Loading medications...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load medications. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No medications found. Add your first medication using the form above.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {medications.map((medication) => (
        <MedicationCard key={medication.id} medication={medication} />
      ))}
    </div>
  );
}
