"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginButton } from "@/components/auth/login-button";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-6">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <h1 className="hidden text-xl font-bold text-primary md:block">
            TwitchLive
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 md:justify-between">
          <div className="hidden w-full max-w-xl md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search streams..."
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            )}
            <ThemeToggle />
            {isAuthenticated ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}