import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chart from "chart.js/auto";

interface EnergyData {
  date: Date;
  lightingKwh: number;
  acKwh: number;
  devicesKwh: number;
  totalKwh: number;
}

interface EnergyConsumptionChartProps {
  data: EnergyData[];
  isLoading: boolean;
}

const EnergyConsumptionChart = ({ data, isLoading }: EnergyConsumptionChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    if (!chartRef.current || isLoading || !data || data.length === 0) return;

    // Clean up the previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Format data for the chart
    const formatDate = (date: Date): string => {
      if (period === 'daily') {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (period === 'weekly') {
        return `W${Math.ceil(date.getDate() / 7)}`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    // Extract dates and values from data
    const labels = data.map(d => formatDate(new Date(d.date)));
    const lightingData = data.map(d => d.lightingKwh);
    const acData = data.map(d => d.acKwh);
    const devicesData = data.map(d => d.devicesKwh);

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Lights',
            data: lightingData,
            borderColor: 'hsl(var(--primary))',
            backgroundColor: 'hsla(var(--primary), 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Air Conditioning',
            data: acData,
            borderColor: 'hsl(var(--secondary))',
            backgroundColor: 'hsla(var(--secondary), 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Laptops & Devices',
            data: devicesData,
            borderColor: 'hsl(var(--accent))',
            backgroundColor: 'hsla(var(--accent), 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return value + ' kWh';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLoading, period]);

  // Calculate total energy by category
  const totals = data?.reduce((acc, curr) => {
    acc.lighting += curr.lightingKwh;
    acc.ac += curr.acKwh;
    acc.devices += curr.devicesKwh;
    return acc;
  }, { lighting: 0, ac: 0, devices: 0 }) || { lighting: 0, ac: 0, devices: 0 };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="h-[400px] bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Energy Consumption</h3>
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <Button 
              variant={period === 'daily' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setPeriod('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={period === 'weekly' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setPeriod('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={period === 'monthly' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Lights</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-secondary rounded-full mr-2"></span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Air Conditioning</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-accent rounded-full mr-2"></span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Laptops & Devices</span>
          </div>
        </div>
        
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-neutral-600 dark:text-neutral-400">
          <div>
            <p className="font-semibold">{Math.round(totals.lighting)} kWh</p>
            <p>Lights</p>
          </div>
          <div>
            <p className="font-semibold">{Math.round(totals.ac)} kWh</p>
            <p>Air Conditioning</p>
          </div>
          <div>
            <p className="font-semibold">{Math.round(totals.devices)} kWh</p>
            <p>Laptops & Devices</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyConsumptionChart;
