import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Users, Monitor, Sun, Bot } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  potentialSavings: string;
  isApplied: boolean;
  createdAt: Date;
}

const Recommendations = () => {
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
  });

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
        return <Lightbulb className="text-sm" />;
      case 'Seating':
        return <Users className="text-sm" />;
      case 'Devices':
        return <Monitor className="text-sm" />;
      case 'Lighting':
        return <Sun className="text-sm" />;
      default:
        return <Lightbulb className="text-sm" />;
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

  const handleApplyRecommendations = () => {
    // Apply all recommendations one by one
    if (data) {
      data.forEach(rec => {
        if (!rec.isApplied) {
          applyMutation.mutate(rec.id);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 bg-primary">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
            <Bot className="text-white h-6 w-6" />
          </div>
          <p className="text-sm text-primary-100 mt-1">Generated based on your office energy patterns</p>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4 max-h-[280px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start animate-pulse">
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                <div className="ml-4 w-full">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-border">
          <Button className="w-full" disabled>
            Apply Recommendations
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 bg-primary">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          <Bot className="text-white h-6 w-6" />
        </div>
        <p className="text-sm text-primary-100 mt-1">Generated based on your office energy patterns</p>
      </div>
      
      <ScrollArea className="p-6 max-h-[280px]">
        <div className="space-y-4">
          {data && data.map((recommendation) => (
            <div key={recommendation.id} className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(recommendation.category)}`}>
                {getCategoryIcon(recommendation.category)}
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium">{recommendation.title}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{recommendation.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <CardFooter className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-border">
        <Button 
          className="w-full"
          onClick={handleApplyRecommendations}
          disabled={applyMutation.isPending || (data && data.every(r => r.isApplied))}
        >
          {applyMutation.isPending ? "Applying..." : "Apply Recommendations"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Recommendations;
