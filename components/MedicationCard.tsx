'use client';

import { Medication } from '@/types/medication';
import { calculateMedicationStatus, formatDate, getStatusLabel } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useDeleteMedication, useUpdateDose } from '@/lib/hooks/useMedications';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import EditMedicationForm from './EditMedicationForm';

interface MedicationCardProps {
  medication: Medication;
}

export default function MedicationCard({ medication }: MedicationCardProps) {
  const status = calculateMedicationStatus(medication);
  const deleteMutation = useDeleteMedication();
  const updateDoseMutation = useUpdateDose();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(medication.id);
    setDeleteOpen(false);
  };

  const handleDoseUpdate = async (doseStatus: 'taken' | 'missed') => {
    const today = new Date().toISOString().split('T')[0];
    await updateDoseMutation.mutateAsync({
      medicationId: medication.id,
      date: `${today}T00:00:00`,
      status: doseStatus,
    });
  };

  const todayDose = medication.doses.find(d =>
    d.date.startsWith(new Date().toISOString().split('T')[0])
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{medication.name}</CardTitle>
            <p className="text-sm text-gray-600">{medication.dosageAmount}{medication.dosageUnit}</p>
          </div>
          <Badge>{getStatusLabel(status.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Medication Remaining</span>
            <span className="font-semibold">{status.percentRemaining}%</span>
          </div>
          <Progress value={status.percentRemaining} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Doses Remaining</p>
            <p className="font-semibold">{status.dosesRemaining}</p>
          </div>
          <div>
            <p className="text-gray-600">Days Remaining</p>
            <p className="font-semibold">{status.daysRemaining}</p>
          </div>
          <div>
            <p className="text-gray-600">Refill Date</p>
            <p className="font-semibold">{formatDate(status.refillDate)}</p>
          </div>
          <div>
            <p className="text-gray-600">Adherence</p>
            <p className="font-semibold">{status.adherencePercentage}%</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Today&apos;s Dose</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={todayDose?.status === 'taken' ? 'default' : 'outline'}
              onClick={() => handleDoseUpdate('taken')}
            >
              Taken
            </Button>
            <Button
              size="sm"
              onClick={() => handleDoseUpdate('missed')}
            >
              Missed
            </Button>
          </div>
        </div>

        <div className="flex gap-2 border-t pt-4">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Medication</DialogTitle>
              </DialogHeader>
              <EditMedicationForm
                medication={medication}
                onSuccess={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete}>
                Delete
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
