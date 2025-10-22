import { Medication, MedicationStatus, DoseRecord } from '@/types/medication';

/**
 * Calculate medication status including refill dates, adherence, and remaining doses
 */
export function calculateMedicationStatus(medication: Medication): MedicationStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(medication.startDate);
  startDate.setHours(0, 0, 0, 0);

  // Calculate actual doses taken from dose records
  const takenDoses = medication.doses.filter(d => d.status === 'taken').length;
  const missedDoses = medication.doses.filter(d => d.status === 'missed').length;

  // Calculate adherence percentage
  const totalRecordedDoses = takenDoses + missedDoses;
  const adherencePercentage = totalRecordedDoses > 0
    ? Math.round((takenDoses / totalRecordedDoses) * 100)
    : 100;

  // Calculate doses remaining
  const dosesUsed = takenDoses;
  const dosesRemaining = Math.max(0, medication.quantityReceived - dosesUsed);

  // Calculate days remaining
  const daysRemaining = medication.frequency > 0
    ? Math.floor(dosesRemaining / medication.frequency)
    : 0;

  // Calculate refill date
  const refillDate = new Date(today);
  refillDate.setDate(refillDate.getDate() + daysRemaining);

  // Calculate percent remaining
  const percentRemaining = medication.quantityReceived > 0
    ? Math.round((dosesRemaining / medication.quantityReceived) * 100)
    : 0;

  // Determine status
  let status: 'on-track' | 'running-low' | 'overdue';
  if (daysRemaining <= 0) {
    status = 'overdue';
  } else if (daysRemaining <= 7) {
    status = 'running-low';
  } else {
    status = 'on-track';
  }

  return {
    medication,
    dosesRemaining,
    daysRemaining,
    refillDate: refillDate.toISOString(),
    status,
    adherencePercentage,
    percentRemaining
  };
}

/**
 * Get all medications that need refills soon (only on 7th day before refill and on refill day)
 */
export function getMedicationsNeedingRefill(medications: Medication[]): MedicationStatus[] {
  return medications
    .map(calculateMedicationStatus)
    .filter(status => {
      // Show alert only on exactly 7 days before refill OR on refill day (0 days remaining)
      return status.daysRemaining === 7 || status.daysRemaining === 0;
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Generate scheduled doses for a medication from start date to today
 */
export function generateScheduledDoses(medication: Medication): DoseRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(medication.startDate);
  startDate.setHours(0, 0, 0, 0);

  const scheduledDoses: DoseRecord[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    // Add doses for each day based on frequency
    for (let i = 0; i < medication.frequency; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];

      // Check if there's already a record for this dose
      const existingDose = medication.doses.find(d =>
        d.date.startsWith(dateStr) &&
        medication.doses.filter(dose => dose.date.startsWith(dateStr)).indexOf(d) === i
      );

      if (!existingDose) {
        scheduledDoses.push({
          date: `${dateStr}T${String(i).padStart(2, '0')}:00:00`,
          status: 'scheduled'
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return scheduledDoses;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: 'on-track' | 'running-low' | 'overdue'): string {
  switch (status) {
    case 'on-track':
      return 'On Track';
    case 'running-low':
      return 'Running Low';
    case 'overdue':
      return 'Refill Overdue';
  }
}
