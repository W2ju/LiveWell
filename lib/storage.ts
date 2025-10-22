import { Medication } from '@/types/medication';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'medications.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read medications from JSON file
function readMedications(): Medication[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading medications:', error);
    return [];
  }
}

// Write medications to JSON file
function writeMedications(medications: Medication[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(medications, null, 2));
  } catch (error) {
    console.error('Error writing medications:', error);
  }
}

export const storage = {
  getAll: (): Medication[] => {
    return readMedications();
  },

  getById: (id: string): Medication | undefined => {
    const medications = readMedications();
    return medications.find(m => m.id === id);
  },

  create: (medication: Medication): Medication => {
    const medications = readMedications();
    medications.push(medication);
    writeMedications(medications);
    return medication;
  },

  update: (id: string, updates: Partial<Medication>): Medication | null => {
    const medications = readMedications();
    const index = medications.findIndex(m => m.id === id);
    if (index === -1) return null;

    medications[index] = { ...medications[index], ...updates };
    writeMedications(medications);
    return medications[index];
  },

  delete: (id: string): boolean => {
    const medications = readMedications();
    const index = medications.findIndex(m => m.id === id);
    if (index === -1) return false;

    medications.splice(index, 1);
    writeMedications(medications);
    return true;
  }
};
