# Prescription Refill Tracker

A web application to help patients track medications, calculate refill schedules, and monitor medication adherence.

## Features

### Core Functionality
- **Add Medications**: Add medications with name, dosage, frequency, start date, quantity received, and days supply
- **View Medications**: See all medications in a card-based layout with status indicators
- **Edit/Delete**: Update medication details or remove medications
- **Refill Calculator**: Automatically calculates:
  - Doses remaining
  - Days remaining
  - Next refill date
  - Visual progress bar showing medication remaining
- **Status Indicators**:
  - **On Track**: More than 7 days remaining
  - **Running Low**: 1-7 days remaining (yellow alert)
  - **Overdue**: Refill needed now (red alert)
- **Dose Tracking**: Mark daily doses as "taken" or "missed"
- **Adherence Monitoring**: View adherence percentage based on taken vs missed doses
- **Refill Alerts**: Automatic alerts for medications needing refills within 7 days

### Bonus Features Implemented
- **Medication Search**: Search medications using OpenFDA API
- **CSV Export**: Export refill schedule to CSV file
- **Local Storage**: Automatic sync to browser local storage for offline access
- **Responsive Design**: Fully responsive mobile-first design using Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 with React
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Data Storage**: Local JSON file (no database required)
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding a Medication

**Option 1: Search from FDA Database**
1. Click "Search Medications" button
2. Type medication name (e.g., "Lisinopril")
3. Select from search results to auto-fill name and dosage

**Option 2: Manual Entry**
1. Fill out the "Add New Medication" form:
   - **Medication Name**: e.g., "Lisinopril"
   - **Dosage**: e.g., "10mg"
   - **Frequency**: Number of doses per day (e.g., 2)
   - **Start Date**: When you started taking the medication
   - **Quantity Received**: Total number of pills/doses (e.g., 30)
   - **Days Supply**: Expected number of days the medication should last (e.g., 30)

2. Click "Add Medication"

### Tracking Doses

On each medication card, you can:
- Click **"Taken"** to mark today's dose as taken
- Click **"Missed"** to mark today's dose as missed
- View your adherence percentage

### Understanding the Calculations

Example:
- 30 tablets received
- 2 doses per day
- Started 10 days ago
- 10 doses taken

**Calculations:**
- Doses Remaining: 30 - 10 = 20 tablets
- Days Remaining: 20 ÷ 2 = 10 days
- Next Refill: Today + 10 days
- Adherence: 10 taken / (10 expected) = 100%

### Refill Alerts

Medications needing refills soon will appear at the top of the page with:
- Yellow alert: 1-7 days remaining
- Red alert: Refill overdue

### Exporting Data

Click the "Export to CSV" button in the header to download a CSV file containing:
- All medication details
- Current status
- Refill dates
- Adherence percentages

The exported file can be opened in Excel or Google Sheets.

## Project Structure

```
prescription-tracker/
├── app/
│   ├── api/
│   │   └── medications/      # API routes for CRUD operations
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── MedicationForm.tsx         # Add medication form
│   ├── EditMedicationForm.tsx     # Edit medication form
│   ├── MedicationCard.tsx         # Medication display card
│   ├── MedicationList.tsx         # List of all medications
│   ├── MedicationSearchDialog.tsx # FDA medication search
│   ├── RefillAlerts.tsx           # Refill alert banner
│   └── ExportButton.tsx           # CSV export button
├── lib/
│   ├── calculations.ts            # Refill and adherence calculations
│   ├── storage.ts                 # JSON file storage utilities
│   ├── localStorage.ts            # Browser local storage utilities
│   ├── exportUtils.ts             # CSV export utilities
│   ├── providers.tsx              # TanStack Query provider
│   └── hooks/
│       ├── useMedications.ts      # Medication CRUD hooks
│       └── useMedicationSearch.ts # FDA search hook
├── types/
│   └── medication.ts         # TypeScript interfaces
└── data/
    └── medications.json      # Data storage (auto-created)
```

## API Endpoints

- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create new medication
- `GET /api/medications/[id]` - Get single medication
- `PUT /api/medications/[id]` - Update medication
- `DELETE /api/medications/[id]` - Delete medication
- `POST /api/medications/[id]/doses` - Update dose status
- `GET /api/medications/refills` - Get medications needing refills

## Data Storage

Data is persisted in two locations:

1. **Server Storage**: Local JSON file at `/data/medications.json` (auto-created, excluded from git)
2. **Browser Storage**: Automatically synced to browser local storage for offline access

Both storage methods work together to provide:
- Persistence across browser sessions
- Offline access to medication data
- Automatic synchronization

## Development

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## Implemented Features Summary

All core requirements and bonus features have been implemented:

### Core Requirements ✓
- [x] Add medications with full details
- [x] View all medications in list
- [x] Edit and delete medications
- [x] Calculate doses/days remaining
- [x] Calculate refill dates
- [x] Automatic refill alerts (7 days)
- [x] Visual progress indicators
- [x] Mark doses as taken/missed
- [x] Track adherence percentage

### Bonus Features ✓
- [x] Medication search using OpenFDA API
- [x] Export refill schedule to CSV
- [x] Fully responsive mobile design
- [x] Local storage persistence

### Technical Excellence ✓
- [x] TypeScript with full type safety
- [x] TanStack Query for all data fetching
- [x] Clean component architecture
- [x] Form validation and error handling
- [x] shadcn/ui for consistent UI components

## Future Enhancements

Additional features that could be added:
- PDF export functionality
- Multiple users/profiles
- Push notification system
- Medication interaction warnings
- Medication history tracking
- Integration with pharmacy APIs
- Barcode scanning for medication entry

## License

MIT
