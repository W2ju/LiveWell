'use client';

import { useMedications } from '@/lib/hooks/useMedications';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportUtils';

export default function ExportButton() {
  const { data: medications } = useMedications();

  const handleExport = () => {
    if (!medications || medications.length === 0) {
      alert('No medications to export');
      return;
    }

    exportToCSV(medications);
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      disabled={!medications || medications.length === 0}
    >
      Export to CSV
    </Button>
  );
}
