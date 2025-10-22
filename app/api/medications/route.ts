import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { Medication } from '@/types/medication';
import { randomUUID } from 'crypto';
import { createMedicationSchema } from '@/lib/validations/medication';
import { ZodError } from 'zod';

// GET all medications
export async function GET() {
  try {
    const medications = storage.getAll();
    return NextResponse.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}

// POST create new medication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = createMedicationSchema.parse(body);

    const medication: Medication = {
      id: randomUUID(),
      ...validatedData,
      doses: []
    };

    const created = storage.create(medication);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating medication:', error);
    return NextResponse.json(
      { error: 'Failed to create medication' },
      { status: 500 }
    );
  }
}
