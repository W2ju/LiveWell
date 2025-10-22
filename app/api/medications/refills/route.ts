import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getMedicationsNeedingRefill } from '@/lib/calculations';

// GET medications needing refills
export async function GET() {
  try {
    const medications = storage.getAll();
    const needingRefill = getMedicationsNeedingRefill(medications);
    return NextResponse.json(needingRefill);
  } catch (error) {
    console.error('Error fetching medications needing refill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications needing refill' },
      { status: 500 }
    );
  }
}
