import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Expand, Eye } from "lucide-react";

export interface OfficeZone {
  id: number;
  name: string;
  currentUsageKw: number;
  averageUsageKw: number;
  usageStatus: string;
  percentFromAverage: number;
}

interface OfficeEnergyHeatmapProps {
  zones: OfficeZone[];
  isLoading: boolean;
}

const OfficeEnergyHeatmap = ({ zones, isLoading }: OfficeEnergyHeatmapProps) => {
  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Office Energy Heatmap</h3>
            <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
          
          <div className="relative border border-border rounded-lg overflow-hidden h-60 bg-neutral-100 dark:bg-neutral-800 animate-pulse"></div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg animate-pulse">
                <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!zones || zones.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Office Energy Heatmap</h3>
          <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No office zone data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High Usage':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium Usage':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low Usage':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Optimal':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  const getPercentColor = (percent: number) => {
    if (percent > 10) return 'text-red-600 dark:text-red-400';
    if (percent > 0) return 'text-yellow-600 dark:text-yellow-400';
    if (percent < -10) return 'text-green-600 dark:text-green-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const formatPercent = (percent: number) => {
    if (percent > 0) return `+${percent}% above avg.`;
    if (percent < 0) return `${percent}% below avg.`;
    return 'On target';
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Office Energy Heatmap</h3>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Last updated:</span> Today, 2:45 PM
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Expand className="h-4 w-4 mr-1" />
              <span>Expand View</span>
            </Button>
          </div>
        </div>
        
        {/* Office heatmap visualization */}
        <div className="relative border border-border rounded-lg overflow-hidden">
          {/* This would be replaced with a real map/floorplan in a production app */}
          <div className="aspect-[2/1] w-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center relative">
            <svg
              viewBox="0 0 800 400"
              width="100%"
              height="100%"
              className="text-neutral-300 dark:text-neutral-700"
            >
              <rect x="50" y="50" width="300" height="150" stroke="currentColor" strokeWidth="2" fill="none" />
              <text x="200" y="125" textAnchor="middle" className="text-sm fill-current">West Wing</text>
              
              <rect x="450" y="50" width="300" height="150" stroke="currentColor" strokeWidth="2" fill="none" />
              <text x="600" y="125" textAnchor="middle" className="text-sm fill-current">East Wing</text>
              
              <rect x="50" y="250" width="300" height="100" stroke="currentColor" strokeWidth="2" fill="none" />
              <text x="200" y="300" textAnchor="middle" className="text-sm fill-current">North Wing</text>
              
              <rect x="450" y="250" width="300" height="100" stroke="currentColor" strokeWidth="2" fill="none" />
              <text x="600" y="300" textAnchor="middle" className="text-sm fill-current">Conference Rooms</text>
            </svg>
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-green-500/20 to-red-500/30"></div>
            
            {/* Hotspots */}
            <div className="absolute top-[35%] left-[28%] w-8 h-8 bg-red-500 bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer animate-pulse">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            
            <div className="absolute top-[65%] right-[32%] w-8 h-8 bg-yellow-500 bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer animate-pulse">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-card p-3 rounded-lg shadow-md flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{zone.name}</h4>
                <Badge variant="outline" className={getStatusColor(zone.usageStatus)}>
                  {zone.usageStatus}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">Current: {zone.currentUsageKw} kW</span>
                <span className={`text-xs font-medium ${getPercentColor(zone.percentFromAverage)}`}>
                  {formatPercent(zone.percentFromAverage)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficeEnergyHeatmap;
