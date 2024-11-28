'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabase } from '@/providers/supabase-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginButton() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });
  const supabase = useSupabase();

  useEffect(() => {
    if (status.type === 'success') {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setOpen(false);
          setIsClosing(false);
          setEmail('');
          setPassword('');
          setStatus({ type: null, message: null });
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: null });
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
          },
        });
        
        if (error) throw error;
        
        setStatus({
          type: 'success',
          message: 'Check your email for the confirmation link.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        setOpen(false);
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'An error occurred during authentication.',
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isClosing) return;
    setOpen(newOpen);
    if (!newOpen) {
      setEmail('');
      setPassword('');
      setStatus({ type: null, message: null });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[425px] transition-all duration-500",
        isClosing && "opacity-0 scale-95"
      )}>
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
          {isSignUp && (
            <DialogDescription>
              Create an account to follow your favorite streamers.
            </DialogDescription>
          )}
        </DialogHeader>
        {status.type && (
          <Alert 
            variant={status.type === 'success' ? 'default' : 'destructive'}
            className={cn(
              'animate-in fade-in-0 slide-in-from-top-5 duration-300',
              status.type === 'success' && 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
            )}
          >
            {status.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className="font-medium">
              {status.message}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStatus({ type: null, message: null });
              }}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}