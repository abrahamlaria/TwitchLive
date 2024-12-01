'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import type { Notification } from '@/types/notification';

export function useNotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const supabase = useSupabase();
  const { user } = useAuth();

  const hasUnread = notifications.some(notification => !notification.read);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const clearNotifications = async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  return {
    notifications,
    hasUnread,
    loading,
    clearNotifications,
    markAllAsRead,
    removeNotification,
    open,
    setOpen,
  };
}