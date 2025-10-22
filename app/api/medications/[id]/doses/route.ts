import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { doseUpdateSchema } from '@/lib/validations/medication';
import { ZodError } from 'zod';

// POST update dose status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = doseUpdateSchema.parse({
      medicationId: id,
      ...body
    });

    const medication = storage.getById(id);

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    // Find or create dose record
    const existingDoseIndex = medication.doses.findIndex(d => d.date === validatedData.date);

    if (existingDoseIndex >= 0) {
      medication.doses[existingDoseIndex].status = validatedData.status;
    } else {
      medication.doses.push({
        date: validatedData.date,
        status: validatedData.status
      });
    }

    const updated = storage.update(id, { doses: medication.doses });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating dose:', error);
    return NextResponse.json(
      { error: 'Failed to update dose' },
      { status: 500 }
    );
  }
}
