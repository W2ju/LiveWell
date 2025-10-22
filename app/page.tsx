'use client';

import MedicationForm from '@/components/MedicationForm';
import MedicationList from '@/components/MedicationList';
import ExportButton from '@/components/ExportButton';
import RefillAlertPopup from '@/components/RefillAlertPopup';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RefillAlertPopup />

      <header className="bg-white shadow">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Prescription Refill Tracker
          </h1>
          <ExportButton />
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <MedicationForm />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              My Medications
            </h2>
            <MedicationList />
          </div>
        </div>
      </main>
    </div>
  );
}