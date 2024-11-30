'use client';

import { useNotifications } from '@/hooks/use-notifications';

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  // Initialize notifications system
  useNotifications();
  
  return <>{children}</>;
}