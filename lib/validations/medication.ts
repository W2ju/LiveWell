import { z } from 'zod';

// Dosage unit enum
export const dosageUnitSchema = z.enum(['mg', 'g', 'mcg', 'ml', 'IU', 'units']);

// Dose status enum
export const doseStatusSchema = z.enum(['taken', 'missed', 'scheduled']);

// Dose record schema
export const doseRecordSchema = z.object({
  date: z.string(), 
  status: doseStatusSchema,
});

// Create medication schema
export const createMedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required').trim(),
  dosageAmount: z.number().positive('Dosage amount must be greater than 0'),
  dosageUnit: dosageUnitSchema,
  frequency: z.number().int().positive('Frequency must be greater than 0'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  quantityReceived: z.number().int().positive('Quantity must be greater than 0'),
  daysSupply: z.number().int().positive('Days supply must be greater than 0'),
});

// Update medication schema (all fields optional except id)
export const updateMedicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Medication name is required').trim().optional(),
  dosageAmount: z.number().positive('Dosage amount must be greater than 0').optional(),
  dosageUnit: dosageUnitSchema.optional(),
  frequency: z.number().int().positive('Frequency must be greater than 0').optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  quantityReceived: z.number().int().positive('Quantity must be greater than 0').optional(),
  daysSupply: z.number().int().positive('Days supply must be greater than 0').optional(),
});

// Dose update schema
export const doseUpdateSchema = z.object({
  medicationId: z.string(),
  date: z.string(), // Accept any date string format (YYYY-MM-DD or ISO datetime)
  status: z.enum(['taken', 'missed']),
});

// Full medication schema (includes all fields)
export const medicationSchema = createMedicationSchema.extend({
  id: z.string(),
  doses: z.array(doseRecordSchema).default([]),
});

// Type exports
export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
export type DoseUpdateInput = z.infer<typeof doseUpdateSchema>;
export type DosageUnit = z.infer<typeof dosageUnitSchema>;
export type DoseStatus = z.infer<typeof doseStatusSchema>;
