import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateMedicationDTO, Medication, MedicationStatus, UpdateMedicationDTO } from '@/types/medication';
import { localStorageUtil } from '@/lib/localStorage';

const API_BASE = '/api/medications';

// Fetch functions
const fetchMedications = async (): Promise<Medication[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Failed to fetch medications');
  const data = await response.json();
  // Save to local storage
  localStorageUtil.save(data);
  return data;
};

const fetchMedication = async (id: string): Promise<Medication> => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch medication');
  return response.json();
};

const createMedication = async (data: CreateMedicationDTO): Promise<Medication> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create medication');
  }
  return response.json();
};

const updateMedication = async ({ id, ...data }: UpdateMedicationDTO): Promise<Medication> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update medication');
  }
  return response.json();
};

const deleteMedication = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete medication');
};

const updateDose = async (medicationId: string, date: string, status: 'taken' | 'missed'): Promise<Medication> => {
  const response = await fetch(`${API_BASE}/${medicationId}/doses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, status }),
  });
  if (!response.ok) throw new Error('Failed to update dose');
  return response.json();
};

const fetchRefills = async (): Promise<MedicationStatus[]> => {
  const response = await fetch(`${API_BASE}/refills`);
  if (!response.ok) throw new Error('Failed to fetch refills');
  return response.json();
};

// Hooks
export function useMedications() {
  return useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
  });
}

export function useMedication(id: string) {
  return useQuery({
    queryKey: ['medications', id],
    queryFn: () => fetchMedication(id),
    enabled: !!id,
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['refills'] });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMedication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refills'] });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['refills'] });
    },
  });
}

export function useUpdateDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medicationId, date, status }: { medicationId: string; date: string; status: 'taken' | 'missed' }) =>
      updateDose(medicationId, date, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refills'] });
    },
  });
}

export function useRefills() {
  return useQuery({
    queryKey: ['refills'],
    queryFn: fetchRefills,
  });
}
