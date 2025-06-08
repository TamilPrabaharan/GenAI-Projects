import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Medal, Info, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface User {
  id: number;
  fullName: string;
  department: string;
  avatarUrl: string;
  awePoints: number;
}

const EmployeeLeaderboard = () => {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users/leaderboard?limit=5'],
  });

  const getPositionBadgeStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-primary text-white";
      case 2:
        return "bg-neutral-400 text-white";
      case 3:
        return "bg-amber-700 text-white";
      default:
        return "bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300";
    }
  };

  const getRowBackground = (position: number) => {
    return position === 1 
      ? "bg-primary-50 dark:bg-primary-900/10" 
      : "bg-neutral-50 dark:bg-neutral-900/50";
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Employee Leaderboard</h3>
          <Info className="h-4 w-4 text-neutral-400" />
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-3 px-1">
            <span>Employee</span>
            <span>Awe Points</span>
          </div>
          
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                  <div className="ml-3">
                    <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded mt-1"></div>
                  </div>
                </div>
                <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-4 border-t border-border bg-neutral-50 dark:bg-neutral-900/80">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Medal className="h-4 w-4 text-accent mr-1" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Your position: <span className="font-semibold">Loading...</span>
              </span>
            </div>
            <Button variant="link" className="text-primary" disabled>
              View Full Leaderboard
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">Employee Leaderboard</h3>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No leaderboard data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold">Employee Leaderboard</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4 text-neutral-400" />
                <span className="sr-only">Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              <p className="text-xs">Employees earn points for eco-friendly actions like using dark mode, proper power management, and optimal workspace usage.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      
      <CardContent className="px-6 py-4">
        <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-3 px-1">
          <span>Employee</span>
          <span>Awe Points</span>
        </div>
        
        <div className="space-y-3">
          {data.map((user, index) => (
            <div key={user.id} className={`flex items-center justify-between p-3 ${getRowBackground(index + 1)} rounded-lg`}>
              <div className="flex items-center">
                <div className={`w-7 h-7 flex items-center justify-center ${getPositionBadgeStyle(index + 1)} rounded-full text-xs font-bold`}>
                  {index + 1}
                </div>
                <div className="flex items-center ml-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.department}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold">{user.awePoints.toLocaleString()}</span>
                {index === 0 && <Crown className="text-yellow-500 ml-2 h-4 w-4" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 border-t border-border bg-neutral-50 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Medal className="h-4 w-4 text-accent mr-1" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Your position: <span className="font-semibold">12th</span>
            </span>
          </div>
          <Link href="/employees">
            <Button variant="link" className="text-primary">
              View Full Leaderboard
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeLeaderboard;
