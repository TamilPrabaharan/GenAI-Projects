import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Lightbulb,
  Users,
  Monitor,
  Sun,
  Bot,
  Check,
  Brain,
  Sparkles,
  ChevronRight,
  Clock,
  Cpu,
  Leaf,
  LineChart,
  BarChart3,
  Award,
} from "lucide-react";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  potentialSavings: string;
  isApplied: boolean;
  createdAt: Date;
}

const RecommendationsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch all recommendations
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
  });

  // Apply recommendation mutation
  const applyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('POST', `/api/recommendations/${id}/apply`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/summary'] });
      toast({
        title: "Recommendation applied",
        description: "The recommendation has been successfully applied.",
      });
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AC':
        return <Lightbulb className="h-5 w-5" />;
      case 'Seating':
        return <Users className="h-5 w-5" />;
      case 'Devices':
        return <Monitor className="h-5 w-5" />;
      case 'Lighting':
        return <Sun className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AC':
        return 'bg-primary-100 dark:bg-primary-900/30 text-primary';
      case 'Seating':
        return 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary';
      case 'Devices':
        return 'bg-accent-100 dark:bg-accent-900/30 text-accent';
      case 'Lighting':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300';
    }
  };

  // Filter recommendations based on active tab
  const filteredRecommendations = recommendations?.filter(rec => {
    if (activeTab === 'all') return true;
    if (activeTab === 'applied') return rec.isApplied;
    if (activeTab === 'pending') return !rec.isApplied;
    return rec.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Recommendations</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Smart suggestions to optimize energy usage and reduce CO2 emissions
        </p>
      </div>

      {/* Page content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main recommendations list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-border flex justify-between items-center flex-row">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-lg font-semibold">Energy Optimization Recommendations</h2>
              </div>
              <Badge variant="outline" className="px-2 py-1">
                <div className="flex items-center">
                  <Bot className="h-3 w-3 mr-1 text-primary" />
                  <span>AI Generated</span>
                </div>
              </Badge>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 pt-4">
                  <TabsList className="w-full grid grid-cols-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="ac">AC</TabsTrigger>
                    <TabsTrigger value="seating">Seating</TabsTrigger>
                    <TabsTrigger value="devices">Devices</TabsTrigger>
                    <TabsTrigger value="lighting">Lighting</TabsTrigger>
                    <TabsTrigger value="applied">Applied</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value={activeTab} className="pt-4">
                  <ScrollArea className="h-[500px] px-6">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <Card key={i} className="border border-border animate-pulse">
                            <CardContent className="p-6">
                              <div className="flex items-start">
                                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full mr-4"></div>
                                <div className="flex-1">
                                  <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                                  <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-3"></div>
                                  <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : filteredRecommendations && filteredRecommendations.length > 0 ? (
                      <div className="space-y-4">
                        {filteredRecommendations.map((recommendation) => (
                          <Card key={recommendation.id} className={`border ${recommendation.isApplied ? 'border-green-200 dark:border-green-900' : 'border-border'}`}>
                            <CardContent className="p-6">
                              <div className="flex items-start">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getCategoryColor(recommendation.category)}`}>
                                  {getCategoryIcon(recommendation.category)}
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-base font-medium">{recommendation.title}</h3>
                                    {recommendation.isApplied && (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                        <Check className="h-3 w-3 mr-1" /> Applied
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                    {recommendation.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge variant="outline" className="flex items-center">
                                      <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                                      <span>Potential savings: {recommendation.potentialSavings}</span>
                                    </Badge>
                                    {!recommendation.isApplied && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => applyMutation.mutate(recommendation.id)}
                                        disabled={applyMutation.isPending}
                                      >
                                        {applyMutation.isPending ? "Applying..." : "Apply Now"}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                          <Lightbulb className="h-6 w-6 text-neutral-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No recommendations found</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                          {activeTab === "applied" 
                            ? "You haven't applied any recommendations yet." 
                            : "There are no recommendations in this category."}
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="px-6 py-4 border-t border-border">
              <div className="w-full flex items-center justify-between">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Recommendations are updated weekly based on your office's energy usage patterns.
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Refresh <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Impact summary */}
          <Card>
            <CardHeader className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-medium">Impact Summary</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mr-3">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">CO2 Reduction</p>
                    <p className="text-lg font-bold">{
                      recommendations?.filter(r => r.isApplied).length ? "68 kg" : "0 kg"
                    }</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent flex items-center justify-center mr-3">
                    <LineChart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Energy Saved</p>
                    <p className="text-lg font-bold">{
                      recommendations?.filter(r => r.isApplied).length ? "156 kWh" : "0 kWh"
                    }</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary flex items-center justify-center mr-3">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Awe Points Generated</p>
                    <p className="text-lg font-bold">{
                      recommendations?.filter(r => r.isApplied).length ? "450" : "0"
                    }</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Applied Recommendations</p>
                  <p className="text-sm font-medium">{
                    recommendations?.filter(r => r.isApplied).length || 0
                  } / {recommendations?.length || 0}</p>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ 
                      width: recommendations?.length 
                        ? `${(recommendations.filter(r => r.isApplied).length / recommendations.length) * 100}%` 
                        : '0%' 
                    }} 
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automation settings */}
          <Card>
            <CardHeader className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-medium">Automation Settings</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-sm">Auto-apply time-based recommendations</span>
                  </div>
                  <Switch id="auto-time" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-sm">Auto-apply device recommendations</span>
                  </div>
                  <Switch id="auto-device" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-sm">Auto-apply seating recommendations</span>
                  </div>
                  <Switch id="auto-seating" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-sm">Generate weekly efficiency reports</span>
                  </div>
                  <Switch id="weekly-reports" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apply all recommendations */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <Bot className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Apply All Recommendations</h3>
              <p className="text-sm opacity-90 mb-4">
                Automatically apply all pending recommendations to maximize your office energy efficiency.
              </p>
              <Button 
                className="w-full bg-white text-primary hover:bg-white/90" 
                disabled={
                  isLoading || 
                  applyMutation.isPending || 
                  !recommendations?.filter(r => !r.isApplied).length
                }
                onClick={() => {
                  const pendingRecs = recommendations?.filter(r => !r.isApplied) || [];
                  pendingRecs.forEach(rec => {
                    applyMutation.mutate(rec.id);
                  });
                }}
              >
                {applyMutation.isPending 
                  ? "Applying..." 
                  : `Apply ${recommendations?.filter(r => !r.isApplied).length || 0} Recommendations`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
