import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SupabaseProvider } from '@/providers/supabase-provider';
import { Toaster } from '@/components/ui/toaster';
import { NotificationsProvider } from '@/providers/notifications-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TwitchLive - Your Favorite Streamers',
  description: 'Keep track of your favorite streamers and get notified when they go live',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <NotificationsProvider>
              {children}
              <Toaster />
            </NotificationsProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}