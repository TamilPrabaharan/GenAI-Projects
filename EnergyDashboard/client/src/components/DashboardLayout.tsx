import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart4, 
  Users, 
  PieChart, 
  Lightbulb, 
  Settings, 
  HelpCircle, 
  Leaf,
  Menu,
  Bell,
  RefreshCw,
  Maximize,
  ChevronDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get user information
  const { data: userData = {} } = useQuery({
    queryKey: ['/api/users/6'],
    staleTime: 60000,
  });

  const navigationItems = [
    { href: "/", icon: <BarChart4 className="h-5 w-5 mr-3" />, label: "Dashboard" },
    { href: "/employees", icon: <Users className="h-5 w-5 mr-3" />, label: "Employees" },
    { href: "/analytics", icon: <PieChart className="h-5 w-5 mr-3" />, label: "Analytics" },
    { href: "/recommendations", icon: <Lightbulb className="h-5 w-5 mr-3" />, label: "Recommendations" },
    { href: "/settings", icon: <Settings className="h-5 w-5 mr-3" />, label: "Settings" },
  ];

  const resourceItems = [
    { href: "/help", icon: <HelpCircle className="h-5 w-5 mr-3" />, label: "Help Center" },
    { href: "/sustainability-tips", icon: <Leaf className="h-5 w-5 mr-3" />, label: "Sustainability Tips" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  const closeSheet = () => {
    setIsMobileOpen(false);
  };

  // Sidebar content that's used for both desktop and mobile views
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <Leaf className="h-6 w-6 text-primary mr-3" />
          <h1 className="text-xl font-bold text-primary">EcoTrack</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                onClick={closeSheet}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Resources
          </h3>
          <ul className="mt-3 space-y-1">
            {resourceItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                  onClick={closeSheet}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={userData?.avatarUrl} 
              alt={userData?.fullName || "User"} 
            />
            <AvatarFallback>{userData?.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{userData?.fullName || "User"}</p>
            <p className="text-xs text-muted-foreground">{userData?.department || "Sustainability Manager"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar - using Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-3 left-4 z-20">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 sm:max-w-md">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
            {/* Mobile menu button spacer */}
            <div className="w-10 h-10 lg:hidden"></div>

            {/* Date picker */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Period:</span>
              <Select defaultValue="past-7-days">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="past-7-days">Past 7 days</SelectItem>
                  <SelectItem value="past-30-days">Past 30 days</SelectItem>
                  <SelectItem value="this-month">This month</SelectItem>
                  <SelectItem value="last-month">Last month</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive"></span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </div>

              {/* Data refresh */}
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-5 w-5" />
                <span className="sr-only">Refresh data</span>
              </Button>

              {/* Full screen toggle (hidden on mobile) */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Maximize className="h-5 w-5" />
                <span className="sr-only">Toggle fullscreen</span>
              </Button>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
