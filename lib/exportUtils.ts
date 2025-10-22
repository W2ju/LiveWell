import { Medication } from '@/types/medication';
import { calculateMedicationStatus, formatDate } from './calculations';

export function exportToCSV(medications: Medication[]): void {
  // Create CSV header
  const headers = [
    'Medication Name',
    'Dosage',
    'Frequency (per day)',
    'Start Date',
    'Quantity Received',
    'Days Supply',
    'Doses Remaining',
    'Days Remaining',
    'Refill Date',
    'Status',
    'Adherence %'
  ];

  // Create CSV rows
  const rows = medications.map(med => {
    const status = calculateMedicationStatus(med);
    return [
      med.name,
      `${med.dosageAmount}${med.dosageUnit}`,
      med.frequency.toString(),
      formatDate(med.startDate),
      med.quantityReceived.toString(),
      med.daysSupply.toString(),
      status.dosesRemaining.toString(),
      status.daysRemaining.toString(),
      formatDate(status.refillDate),
      status.status,
      `${status.adherencePercentage}%`
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `medication-refill-schedule-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
