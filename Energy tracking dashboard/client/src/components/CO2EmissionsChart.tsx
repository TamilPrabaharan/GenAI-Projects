import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Leaf } from "lucide-react";
import Chart from "chart.js/auto";

interface CO2Breakdown {
  lighting: number;
  ac: number;
  devices: number;
  other: number;
}

interface CarbonOffset {
  current: number;
  target: number;
  percentage: number;
  treesEquivalent: number;
}

interface CO2EmissionsChartProps {
  breakdown: CO2Breakdown;
  offset: CarbonOffset;
  isLoading: boolean;
}

const CO2EmissionsChart = ({ breakdown, offset, isLoading }: CO2EmissionsChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || isLoading || !breakdown) return;

    // Clean up the previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Lighting', 'Air Conditioning', 'Computing', 'Other'],
        datasets: [{
          data: [
            breakdown.lighting,
            breakdown.ac,
            breakdown.devices,
            breakdown.other
          ],
          backgroundColor: [
            'hsl(var(--secondary-400))',
            'hsl(var(--primary))',
            'hsl(var(--accent))',
            'hsl(var(--muted-foreground))'
          ],
          borderWidth: 0,
          hoverOffset: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [breakdown, isLoading]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[400px] bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!breakdown || !offset) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No CO2 emissions data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">CO2 Emissions Breakdown</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-neutral-400" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]">
                <p className="text-xs">CO2 emissions are calculated based on the energy sources and consumption patterns of your office.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut chart */}
          <div>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          
          {/* Emissions breakdown */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-secondary rounded-sm mr-3"></span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Lighting</span>
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{breakdown.lighting} kg</span>
                </div>
                <div className="mt-1 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-secondary h-full rounded-full" 
                    style={{ width: `${(breakdown.lighting / (breakdown.lighting + breakdown.ac + breakdown.devices + breakdown.other)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="w-4 h-4 bg-primary rounded-sm mr-3"></span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Air Conditioning</span>
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{breakdown.ac} kg</span>
                </div>
                <div className="mt-1 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${(breakdown.ac / (breakdown.lighting + breakdown.ac + breakdown.devices + breakdown.other)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="w-4 h-4 bg-accent rounded-sm mr-3"></span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Computing</span>
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{breakdown.devices} kg</span>
                </div>
                <div className="mt-1 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full" 
                    style={{ width: `${(breakdown.devices / (breakdown.lighting + breakdown.ac + breakdown.devices + breakdown.other)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="w-4 h-4 bg-neutral-400 rounded-sm mr-3"></span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Other</span>
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{breakdown.other} kg</span>
                </div>
                <div className="mt-1 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-neutral-400 h-full rounded-full" 
                    style={{ width: `${(breakdown.other / (breakdown.lighting + breakdown.ac + breakdown.devices + breakdown.other)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border">
          <div className="flex items-start">
            <Leaf className="text-green-500 mt-0.5 mr-3 h-5 w-5" />
            <div>
              <h4 className="text-sm font-medium">Carbon Offset Progress</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Your office has offset {offset.current} kg of CO2 this month through renewable energy credits, 
                which is equivalent to planting {offset.treesEquivalent} trees.
              </p>
              <div className="mt-2 bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full" 
                  style={{ width: `${offset.percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-neutral-600 dark:text-neutral-400">Monthly Goal: {offset.target} kg</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{offset.percentage}% Complete</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CO2EmissionsChart;
