import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, CalendarRange } from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [chartType, setChartType] = useState<string>("energy");

  // Fetch energy data for the selected time range
  const { data: energyData, isLoading: isLoadingEnergy } = useQuery({
    queryKey: [`/api/energy?days=${timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90}`],
  });

  // Format data for the energy consumption chart
  const formatEnergyData = () => {
    if (!energyData) return [];
    
    return energyData.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      lighting: item.lightingKwh,
      ac: item.acKwh,
      devices: item.devicesKwh,
      total: item.totalKwh,
    })).reverse(); // Display oldest to newest
  };

  // CO2 emissions data
  const { data: dashboardData } = useQuery({
    queryKey: ['/api/dashboard/summary'],
  });

  const pieChartData = dashboardData?.co2.breakdown ? [
    { name: 'Lighting', value: dashboardData.co2.breakdown.lighting },
    { name: 'Air Conditioning', value: dashboardData.co2.breakdown.ac },
    { name: 'Computing', value: dashboardData.co2.breakdown.devices },
    { name: 'Other', value: dashboardData.co2.breakdown.other },
  ] : [];

  const COLORS = ['hsl(var(--secondary))', 'hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))'];

  // Energy savings data (month-over-month comparison)
  const savingsData = [
    { month: 'Jan', savings: 42 },
    { month: 'Feb', savings: 53 },
    { month: 'Mar', savings: 65 },
    { month: 'Apr', savings: 78 },
    { month: 'May', savings: 85 },
    { month: 'Jun', savings: 90 },
    { month: 'Jul', savings: 120 },
    { month: 'Aug', savings: 110 },
    { month: 'Sep', savings: 95 },
    { month: 'Oct', savings: 105 },
    { month: 'Nov', savings: 115 },
    { month: 'Dec', savings: 125 },
  ];

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Energy Analytics</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Detailed analysis of energy consumption, CO2 emissions, and savings
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-neutral-500" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Analytics content */}
      <Tabs defaultValue="energy" value={chartType} onValueChange={setChartType}>
        <TabsList className="mb-6">
          <TabsTrigger value="energy" className="flex items-center gap-1">
            <LineChartIcon className="h-4 w-4" /> Energy Consumption
          </TabsTrigger>
          <TabsTrigger value="co2" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4" /> CO2 Emissions
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" /> Energy Savings
          </TabsTrigger>
        </TabsList>

        {/* Energy Consumption Analytics */}
        <TabsContent value="energy" className="mt-0">
          <Card>
            <CardHeader className="border-b border-border">
              <h2 className="text-lg font-semibold">Energy Consumption Trends</h2>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingEnergy ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatEnergyData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))"
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="lighting" stroke="hsl(var(--primary))" name="Lighting" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="ac" stroke="hsl(var(--secondary))" name="AC" />
                      <Line type="monotone" dataKey="devices" stroke="hsl(var(--accent))" name="Devices" />
                      <Line type="monotone" dataKey="total" stroke="hsl(var(--muted-foreground))" name="Total" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Energy consumption stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Daily Consumption</p>
                      <h3 className="text-2xl font-bold mt-1">{
                        energyData ? 
                        (energyData.reduce((acc: number, item: any) => acc + item.totalKwh, 0) / energyData.length).toFixed(1) : 
                        "0"
                      } kWh</h3>
                      <div className="flex items-center justify-center mt-2 text-green-500">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">5.3% vs previous</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Peak Consumption Day</p>
                      <h3 className="text-2xl font-bold mt-1">{
                        energyData ? 
                        new Date(energyData.reduce((max: any, item: any) => 
                          item.totalKwh > max.totalKwh ? item : max, energyData[0]).date)
                          .toLocaleDateString('en-US', { weekday: 'long' }) : 
                        "N/A"
                      }</h3>
                      <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Consider staggered schedules
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Projected Monthly Cost</p>
                      <h3 className="text-2xl font-bold mt-1">${
                        energyData ? 
                        ((energyData.reduce((acc: number, item: any) => acc + item.totalKwh, 0) / energyData.length) * 30 * 0.15).toFixed(2) : 
                        "0.00"
                      }</h3>
                      <div className="flex items-center justify-center mt-2 text-green-500">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">$42.50 savings</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CO2 Emissions Analytics */}
        <TabsContent value="co2" className="mt-0">
          <Card>
            <CardHeader className="border-b border-border">
              <h2 className="text-lg font-semibold">CO2 Emissions Analysis</h2>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CO2 Emissions by Source */}
                <div>
                  <h3 className="text-base font-medium mb-4">Emissions by Source</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} kg`, 'CO2 Emissions']}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Carbon Offset Progress */}
                <div>
                  <h3 className="text-base font-medium mb-4">Carbon Offset Progress</h3>
                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Carbon Neutrality Goal</h4>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Tracking against 2023 target</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress: {dashboardData?.co2.offset.percentage || 0}%</span>
                          <span className="text-sm font-medium">{dashboardData?.co2.offset.current || 0} / {dashboardData?.co2.offset.target || 0} kg</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${dashboardData?.co2.offset.percentage || 0}%` }}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-center">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">CO2 Reduction</p>
                          <p className="text-xl font-bold mt-1">{dashboardData?.co2.offset.current || 0} kg</p>
                        </div>
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-center">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Trees Equivalent</p>
                          <p className="text-xl font-bold mt-1">{dashboardData?.co2.offset.treesEquivalent || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Annual Emissions Projection */}
              <div className="mt-6">
                <h3 className="text-base font-medium mb-4">Annual Emissions Projection</h3>
                <Card className="border border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Projected Annual Emissions</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Based on current consumption patterns</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{
                          dashboardData ? 
                          (dashboardData.co2.total * 365 / (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90)).toFixed(0) : 
                          "0"
                        } kg</p>
                        <div className="flex items-center justify-end mt-1 text-green-500">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          <span className="text-xs">12.5% below industry average</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
                        <p className="text-sm font-medium">Reduction Target</p>
                        <p className="text-lg font-bold mt-1">15% YoY</p>
                      </div>
                      <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
                        <p className="text-sm font-medium">Current Pace</p>
                        <p className="text-lg font-bold mt-1 text-green-600">17.2% YoY</p>
                      </div>
                      <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
                        <p className="text-sm font-medium">Carbon Credits</p>
                        <p className="text-lg font-bold mt-1">42 purchased</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Energy Savings Analytics */}
        <TabsContent value="savings" className="mt-0">
          <Card>
            <CardHeader className="border-b border-border">
              <h2 className="text-lg font-semibold">Energy Savings Analysis</h2>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Monthly Energy Savings */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-4">Monthly Energy Savings (kWh)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={savingsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" />
                      <YAxis unit=" kWh" />
                      <Tooltip
                        formatter={(value) => [`${value} kWh`, 'Energy Saved']}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))"
                        }}
                      />
                      <Bar dataKey="savings" fill="hsl(var(--primary))" name="Energy Saved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Savings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Annual Savings</p>
                      <h3 className="text-2xl font-bold mt-1">1,083 kWh</h3>
                      <div className="flex items-center justify-center mt-2 text-green-500">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">18.7% vs last year</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Cost Savings</p>
                      <h3 className="text-2xl font-bold mt-1">$1,624.50</h3>
                      <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Based on current energy rates
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">CO2 Reduction</p>
                      <h3 className="text-2xl font-bold mt-1">455 kg</h3>
                      <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Equivalent to planting 22 trees
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Energy Saving Initiatives */}
              <div className="mt-6">
                <h3 className="text-base font-medium mb-4">Top Energy Saving Initiatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Smart Lighting System</h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Motion-based lighting control and daylight harvesting reduced lighting energy use by 32%
                          </p>
                          <p className="text-sm font-medium text-primary mt-2">185 kWh saved monthly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Zone-Based HVAC</h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Implementing zone-based heating and cooling with occupancy sensors and smart thermostats
                          </p>
                          <p className="text-sm font-medium text-secondary mt-2">210 kWh saved monthly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Computer Power Management</h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Automatic sleep mode activation and dark mode utilization across all office computers
                          </p>
                          <p className="text-sm font-medium text-accent mt-2">95 kWh saved monthly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Natural Light Optimization</h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Rearranged workspaces to maximize natural light and installed light shelves to extend daylight reach
                          </p>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">75 kWh saved monthly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
