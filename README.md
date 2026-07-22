# Advanced HRMS Dashboard - Componentized React/TypeScript

The original single `advanced_hrms_dashboard.tsx` has been split into reusable components.

## Structure
- `src/App.tsx` - page composition and shared state
- `src/components/Sidebar.tsx`
- `src/components/Header.tsx`
- `src/components/KPICards.tsx`
- `src/components/Charts.tsx`
- `src/components/LeaveRequests.tsx`
- `src/components/LiveSessions.tsx`
- `src/components/RecruitmentPipeline.tsx`
- `src/components/UpcomingEvents.tsx`
- `src/components/ActionItems.tsx`
- `src/components/Toast.tsx`
- `src/data/dashboardData.ts`

## Run
npm install
npm run dev

Dependencies: React, TypeScript, Vite, lucide-react, recharts. Tailwind utilities are loaded via CDN in index.html for easy preview.
