import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Award, Medal, Trophy, Crown } from "lucide-react";

interface User {
  id: number;
  fullName: string;
  department: string;
  avatarUrl: string;
  awePoints: number;
}

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users by awe points (descending)
  const sortedUsers = filteredUsers?.sort((a, b) => b.awePoints - a.awePoints);

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Employee Leaderboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Track employee contributions to office energy efficiency and sustainability
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            className="pl-10"
            placeholder="Search employees by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Employee leaderboard */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-accent" />
            <h2 className="text-lg font-semibold">Awe Points Leaderboard</h2>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <div className="flex items-center">
              <Award className="h-3 w-3 mr-1" />
              <span>Total Participants: {users?.length || 0}</span>
            </div>
          </Badge>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0 animate-pulse">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {sortedUsers && sortedUsers.length > 0 ? (
                <div className="space-y-4">
                  {sortedUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border-b border-border last:border-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full mr-4 font-semibold text-sm bg-neutral-100 dark:bg-neutral-800">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                          <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.fullName}</h4>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">{user.awePoints.toLocaleString()} points</span>
                        {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Medal className="h-5 w-5 text-neutral-400" />}
                        {index === 2 && <Medal className="h-5 w-5 text-amber-700" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
                  {searchTerm ? "No employees match your search." : "No employee data available."}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
