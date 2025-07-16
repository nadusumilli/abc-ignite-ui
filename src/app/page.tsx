import { Suspense } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </main>
  );
} 