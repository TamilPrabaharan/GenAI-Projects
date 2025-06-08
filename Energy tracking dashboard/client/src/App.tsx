import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Analytics from "@/pages/Analytics";
import Recommendations from "@/pages/Recommendations";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import SustainabilityTips from "@/pages/SustainabilityTips";
import DashboardLayout from "./components/DashboardLayout";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/employees" component={Employees} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/settings" component={Settings} />
        <Route path="/help" component={Help} />
        <Route path="/sustainability-tips" component={SustainabilityTips} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
