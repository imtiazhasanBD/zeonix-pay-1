"use client";

import {
  Search,
  Bell,
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

type SideNavProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
  role?: 'admin' | 'merchant' | 'staff';
};

export function Header({ role, collapsed, toggleSidebar }: SideNavProps) {
  const pathname = usePathname();
  const pageTitle =
    pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  const handleLogout = () => {
    const redirectMap: Record<string, string> = {
      admin: '/login/admin',
      merchant: '/login/merchant',
    };
    signOut({ callbackUrl: redirectMap[role || 'merchant'] });
  };

  return (
    <header className={`flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[70px] lg:px-6 sticky top-0 z-10 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300 ease-in-out`} >
      <div className="flex gap-2 items-center justify-center">
        {/* Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="ml-auto text-gray-500 hover:text-primary"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
        <h1 className="text-lg font-semibold md:text-2xl capitalize font-headline">
          {pageTitle}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <form className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
          />
        </form>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@flowpanel.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
