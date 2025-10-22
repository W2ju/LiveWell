export interface Medication {
  id: string;
  name: string;
  dosageAmount: number; // numeric value only (e.g., 10)
  dosageUnit: string; // unit (e.g., "mg", "g", "ml")
  frequency: number; // doses per day
  startDate: string; // ISO date string
  quantityReceived: number; // total pills/doses received
  daysSupply: number; // expected days the medication should last
  doses: DoseRecord[];
}

export interface DoseRecord {
  date: string; // ISO date string
  status: 'taken' | 'missed' | 'scheduled';
}

export interface MedicationStatus {
  medication: Medication;
  dosesRemaining: number;
  daysRemaining: number;
  refillDate: string;
  status: 'on-track' | 'running-low' | 'overdue';
  adherencePercentage: number;
  percentRemaining: number;
}

export interface CreateMedicationDTO {
  name: string;
  dosageAmount: number;
  dosageUnit: string;
  frequency: number;
  startDate: string;
  quantityReceived: number;
  daysSupply: number;
}

export interface UpdateMedicationDTO extends Partial<CreateMedicationDTO> {
  id: string;
}

export interface DoseUpdateDTO {
  medicationId: string;
  date: string;
  status: 'taken' | 'missed';
}
