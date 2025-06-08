import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Zap, 
  CloudOff, 
  Award, 
  Users,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  CornerLeftUp,
} from "lucide-react";

interface OverviewStatsProps {
  data: {
    energyUsage: {
      total: number;
      target: number;
      percentage: number;
    };
    co2: {
      total: number;
      target: number;
      percentage: number;
    };
    awePoints: {
      total: number;
      target: number;
      percentage: number;
    };
    users: {
      active: number;
      total: number;
      percentage: number;
    };
  };
}

const OverviewStats = ({ data }: OverviewStatsProps) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="w-full h-[180px] animate-pulse">
            <CardContent className="p-6">
              <div className="h-full bg-neutral-100 dark:bg-neutral-800 rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Energy Usage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Total Energy Usage</p>
              <h3 className="mt-1 text-2xl font-semibold">{data.energyUsage.total} kWh</h3>
              <div className="mt-2 flex items-center">
                <span className="text-green-500 flex items-center text-sm font-medium">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  12%
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-2">vs last week</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full progress-bar" 
                style={{ width: `${data.energyUsage.percentage}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Target: {data.energyUsage.target} kWh</span>
              <span>{data.energyUsage.percentage}% to goal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CO2 Emissions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">CO2 Emissions</p>
              <h3 className="mt-1 text-2xl font-semibold">{data.co2.total} kg</h3>
              <div className="mt-2 flex items-center">
                <span className="text-green-500 flex items-center text-sm font-medium">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  8.3%
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-2">vs last week</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary">
              <CloudOff className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-secondary h-full rounded-full progress-bar" 
                style={{ width: `${data.co2.percentage}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Target: {data.co2.target} kg</span>
              <span>{data.co2.percentage}% to goal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Awe Points */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Awe Points</p>
              <h3 className="mt-1 text-2xl font-semibold">{data.awePoints.total.toLocaleString()}</h3>
              <div className="mt-2 flex items-center">
                <span className="text-green-500 flex items-center text-sm font-medium">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  24%
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-2">vs last week</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full progress-bar" 
                      style={{ width: `${data.awePoints.percentage}%` }}
                    ></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px]">
                  <p className="text-xs">Awe Points are rewarded for eco-friendly actions. Redeem them for office perks or charity donations!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="mt-1 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Monthly Goal: {data.awePoints.target.toLocaleString()}</span>
              <span>{data.awePoints.percentage}% achieved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Active Users</p>
              <h3 className="mt-1 text-2xl font-semibold">{data.users.active} / {data.users.total}</h3>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-500 flex items-center text-sm font-medium">
                  <CornerLeftUp className="mr-1 h-3 w-3" />
                  Same
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-2">as yesterday</span>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-neutral-600 dark:bg-neutral-400 h-full rounded-full progress-bar" 
                style={{ width: `${data.users.percentage}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Participation: {data.users.percentage}%</span>
              <span>{data.users.total - data.users.active} inactive</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewStats;
