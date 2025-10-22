'use client';

import { useCreateMedication } from '@/lib/hooks/useMedications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMedicationSchema } from '@/lib/validations/medication';
import type { CreateMedicationInput } from '@/lib/validations/medication';

interface MedicationFormProps {
  onSuccess?: () => void;
}

export default function MedicationForm({ onSuccess }: MedicationFormProps) {
  const createMutation = useCreateMedication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateMedicationInput>({
    resolver: zodResolver(createMedicationSchema),
    defaultValues: {
      name: '',
      dosageAmount: 0,
      dosageUnit: 'mg',
      frequency: 1,
      startDate: new Date().toISOString().split('T')[0],
      quantityReceived: 0,
      daysSupply: 0,
    },
  });

  const dosageUnit = watch('dosageUnit');

  const onSubmit = async (data: CreateMedicationInput) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create medication:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Medication</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Medication Name *</Label>
            <Input
              id="name"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dosageAmount">Dosage Amount *</Label>
              <Input
                id="dosageAmount"
                type="number"
                {...register('dosageAmount', { valueAsNumber: true })}
              />
              {errors.dosageAmount && <p className="text-sm text-red-500 mt-1">{errors.dosageAmount.message}</p>}
            </div>

            <div>
              <Label htmlFor="dosageUnit">Dosage Unit *</Label>
              <Select
                value={dosageUnit}
                onValueChange={(value) => setValue('dosageUnit', value as 'mg' | 'g' )}
              >
                <SelectTrigger id="dosageUnit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg">mg (milligram)</SelectItem>
                  <SelectItem value="g">g (gram)</SelectItem>
                </SelectContent>
              </Select>
              {errors.dosageUnit && <p className="text-sm text-red-500 mt-1">{errors.dosageUnit.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency (per day) *</Label>
              <Input
                id="frequency"
                type="number"
                {...register('frequency', { valueAsNumber: true })}
              />
              {errors.frequency && <p className="text-sm text-red-500 mt-1">{errors.frequency.message}</p>}
            </div>

            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
              {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantityReceived">Quantity Received *</Label>
              <Input
                id="quantityReceived"
                type="number"
                {...register('quantityReceived', { valueAsNumber: true })}
              />
              {errors.quantityReceived && <p className="text-sm text-red-500 mt-1">{errors.quantityReceived.message}</p>}
            </div>

            <div>
              <Label htmlFor="daysSupply">Days Supply *</Label>
              <Input
                id="daysSupply"
                type="number"
                {...register('daysSupply', { valueAsNumber: true })}
              />
              {errors.daysSupply && <p className="text-sm text-red-500 mt-1">{errors.daysSupply.message}</p>}
            </div>
          </div>

          {createMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>{createMutation.error.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={createMutation.isPending} className="w-full">
            {createMutation.isPending ? 'Adding...' : 'Add Medication'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
