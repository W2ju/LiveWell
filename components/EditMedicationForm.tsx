'use client';

import { useUpdateMedication } from '@/lib/hooks/useMedications';
import { Medication } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMedicationSchema } from '@/lib/validations/medication';
import type { CreateMedicationInput, DosageUnit } from '@/lib/validations/medication';

interface EditMedicationFormProps {
  medication: Medication;
  onSuccess?: () => void;
}

export default function EditMedicationForm({ medication, onSuccess }: EditMedicationFormProps) {
  const updateMutation = useUpdateMedication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateMedicationInput>({
    resolver: zodResolver(createMedicationSchema),
    defaultValues: {
      name: medication.name,
      dosageAmount: medication.dosageAmount,
      dosageUnit: medication.dosageUnit as DosageUnit,
      frequency: medication.frequency,
      startDate: medication.startDate.split('T')[0],
      quantityReceived: medication.quantityReceived,
      daysSupply: medication.daysSupply,
    },
  });

  const dosageUnit = watch('dosageUnit');

  const onSubmit: (data: CreateMedicationInput) => Promise<void> = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: medication.id,
        ...data,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update medication:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Medication Name *</Label>
        <Input
          id="edit-name"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-dosageAmount">Dosage Amount *</Label>
          <Input
            id="edit-dosageAmount"
            type="number"
            step="0.1"
            {...register('dosageAmount', { valueAsNumber: true })}
          />
          {errors.dosageAmount && <p className="text-sm text-red-500 mt-1">{errors.dosageAmount.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-dosageUnit">Dosage Unit *</Label>
          <Select
            value={dosageUnit}
            onValueChange={(value) => setValue('dosageUnit', value as 'mg' | 'g' | 'mcg' | 'ml' | 'IU' | 'units')}
          >
            <SelectTrigger id="edit-dosageUnit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mg">mg (milligram)</SelectItem>
              <SelectItem value="g">g (gram)</SelectItem>
              <SelectItem value="mcg">mcg (microgram)</SelectItem>
              <SelectItem value="ml">ml (milliliter)</SelectItem>
              <SelectItem value="IU">IU (International Unit)</SelectItem>
              <SelectItem value="units">units</SelectItem>
            </SelectContent>
          </Select>
          {errors.dosageUnit && <p className="text-sm text-red-500 mt-1">{errors.dosageUnit.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-frequency">Frequency (per day) *</Label>
          <Input
            id="edit-frequency"
            type="number"
            {...register('frequency', { valueAsNumber: true })}
          />
          {errors.frequency && <p className="text-sm text-red-500 mt-1">{errors.frequency.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-startDate">Start Date *</Label>
          <Input
            id="edit-startDate"
            type="date"
            {...register('startDate')}
          />
          {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-quantityReceived">Quantity Received *</Label>
          <Input
            id="edit-quantityReceived"
            type="number"
            {...register('quantityReceived', { valueAsNumber: true })}
          />
          {errors.quantityReceived && <p className="text-sm text-red-500 mt-1">{errors.quantityReceived.message}</p>}
        </div>

        <div>
          <Label htmlFor="edit-daysSupply">Days Supply *</Label>
          <Input
            id="edit-daysSupply"
            type="number"
            {...register('daysSupply', { valueAsNumber: true })}
          />
          {errors.daysSupply && <p className="text-sm text-red-500 mt-1">{errors.daysSupply.message}</p>}
        </div>
      </div>

      {updateMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{updateMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={updateMutation.isPending} className="w-full">
        {updateMutation.isPending ? 'Updating...' : 'Update Medication'}
      </Button>
    </form>
  );
}
