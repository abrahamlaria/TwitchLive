'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 md:ml-60 w-full overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6">
            <DashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
}