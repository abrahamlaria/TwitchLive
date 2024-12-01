'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Loader2, X } from 'lucide-react';
import { useNotificationPanel } from '@/hooks/use-notification-panel';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export function NotificationPanel() {
  const { 
    notifications, 
    hasUnread,
    loading,
    clearNotifications,
    markAllAsRead,
    removeNotification,
    open,
    setOpen
  } = useNotificationPanel();
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-semibold">Notifications</h4>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearNotifications}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8 px-4 text-center">
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="grid gap-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer relative ${
                    !notification.read ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => {
                    if (notification.streamerId) {
                      router.push(`/stream/${notification.streamerUsername}`);
                      setOpen(false);
                    }
                  }}
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 rounded-full opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}