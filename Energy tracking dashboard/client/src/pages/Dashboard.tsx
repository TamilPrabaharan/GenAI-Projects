import { useQuery } from "@tanstack/react-query";
import OverviewStats from "@/components/OverviewStats";
import EnergyConsumptionChart from "@/components/EnergyConsumptionChart";
import Recommendations from "@/components/Recommendations";
import EmployeeLeaderboard from "@/components/EmployeeLeaderboard";
import CO2EmissionsChart from "@/components/CO2EmissionsChart";
import OfficeEnergyHeatmap from "@/components/OfficeEnergyHeatmap";

const Dashboard = () => {
  // Fetch dashboard summary data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/summary'],
  });

  // Fetch energy data for the chart (last 7 days)
  const { data: energyData, isLoading: isLoadingEnergy } = useQuery({
    queryKey: ['/api/energy?days=7'],
  });

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Renewable Energy Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Monitor energy usage and CO2 emissions for your office environment
        </p>
      </div>

      {/* Dashboard content */}
      <div>
        {/* Overview stats */}
        <OverviewStats data={data} />

        {/* Energy Usage Charts & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Energy consumption chart */}
          <EnergyConsumptionChart data={energyData} isLoading={isLoadingEnergy} />
          
          {/* AI Recommendations */}
          <Recommendations />
        </div>

        {/* Employee Leaderboard and CO2 Emissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Leaderboard */}
          <EmployeeLeaderboard />
          
          {/* CO2 Emissions Chart */}
          <CO2EmissionsChart 
            breakdown={data?.co2.breakdown} 
            offset={data?.co2.offset} 
            isLoading={isLoading}
          />
        </div>

        {/* Office Energy Heatmap */}
        <OfficeEnergyHeatmap zones={data?.zones} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
