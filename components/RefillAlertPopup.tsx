'use client';

import { useEffect, useState } from 'react';
import { useRefills } from '@/lib/hooks/useMedications';
import { formatDate } from '@/lib/calculations';
import { MedicationStatus } from '@/types/medication';

const ALERT_DISMISSED_KEY = 'refill-alerts-dismissed';

export default function RefillAlertPopup() {
  const { data: refills, isLoading } = useRefills();
  const [visibleRefills, setVisibleRefills] = useState<MedicationStatus[]>([]);

  useEffect(() => {
    if (!refills || refills.length === 0) {
      setVisibleRefills([]);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const dismissedDataStr = localStorage.getItem(ALERT_DISMISSED_KEY);

    let dismissedData: Record<string, string> = {};
    if (dismissedDataStr) {
      try {
        dismissedData = JSON.parse(dismissedDataStr);
      } catch {
        localStorage.removeItem(ALERT_DISMISSED_KEY);
        dismissedData = {};
      }
    }

    // Filter refills to only show those not dismissed today
    const notDismissedToday = refills.filter(refill => {
      const medId = refill.medication.id;
      return dismissedData[medId] !== today;
    });

    setVisibleRefills(notDismissedToday);
  }, [refills]);

  const handleDismiss = (medicationId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const dismissedDataStr = localStorage.getItem(ALERT_DISMISSED_KEY);

    let dismissedData: Record<string, string> = {};
    if (dismissedDataStr) {
      try {
        dismissedData = JSON.parse(dismissedDataStr);
      } catch {
        // If parsing fails, start with empty object
        dismissedData = {};
      }
    }

    // Mark this medication as dismissed today
    dismissedData[medicationId] = today;
    localStorage.setItem(ALERT_DISMISSED_KEY, JSON.stringify(dismissedData));

    // Remove from visible list
    setVisibleRefills(prev => prev.filter(r => r.medication.id !== medicationId));
  };

  if (isLoading || visibleRefills.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {visibleRefills.map((status) => (
        <div key={status.medication.id} className="bg-white rounded-lg shadow-lg border p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold">Refill Alert</h3>
            <button
              onClick={() => handleDismiss(status.medication.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-semibold">
              {status.medication.name} - {status.medication.dosageAmount} {status.medication.dosageUnit}
            </p>
            <p>
              {status.daysRemaining === 0
                ? 'Refill needed today!'
                : `Refill needed by ${formatDate(status.refillDate)} (${status.daysRemaining} days)`}
            </p>
            <p className="text-gray-600">
              {status.dosesRemaining} doses remaining ({status.percentRemaining}%)
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center border-t pt-2 mt-2">
            This alert will show once per day
          </p>
        </div>
      ))}
    </div>
  );
}
