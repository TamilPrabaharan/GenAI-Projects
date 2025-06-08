import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Clock, Lightbulb, Monitor, Thermometer, Coffee, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tip {
  id: number;
  title: string;
  description: string;
  category: string;
  potentialSavings: string;
  icon: JSX.Element;
  helpful: number;
  notHelpful: number;
  userVoted?: "helpful" | "notHelpful";
}

const SustainabilityTips = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Mock sustainability tips data
  const [tips, setTips] = useState<Tip[]>([
    {
      id: 1,
      title: "Use Dark Mode",
      description: "Enabling dark mode on your devices can save up to 12% of screen energy on OLED displays. Plus, it reduces eye strain during long work hours.",
      category: "devices",
      potentialSavings: "8-12% screen energy",
      icon: <Monitor />,
      helpful: 24,
      notHelpful: 3
    },
    {
      id: 2,
      title: "Optimize Temperature Settings",
      description: "Adjust office temperature by just 1°C warmer in summer and 1°C cooler in winter to reduce energy consumption by up to 8%. Wear appropriate clothing for the season.",
      category: "ac",
      potentialSavings: "8% HVAC energy",
      icon: <Thermometer />,
      helpful: 18,
      notHelpful: 5
    },
    {
      id: 3,
      title: "Power Down Workstations",
      description: "Configure your computer to sleep after 10 minutes of inactivity and turn off monitors when not in use. This simple habit can save up to 40 kWh per month per workstation.",
      category: "devices",
      potentialSavings: "40 kWh monthly",
      icon: <Monitor />,
      helpful: 31,
      notHelpful: 2
    },
    {
      id: 4,
      title: "Use Natural Light",
      description: "Position your desk near windows and use natural light when possible. Open blinds during daylight hours and turn off unnecessary artificial lighting.",
      category: "lighting",
      potentialSavings: "20-30% lighting energy",
      icon: <Lightbulb />,
      helpful: 27,
      notHelpful: 1
    },
    {
      id: 5,
      title: "Reusable Coffee Cups",
      description: "Bring your own reusable coffee cup to work instead of using disposable ones. This can save up to 23kg of CO2 emissions annually per person.",
      category: "other",
      potentialSavings: "23kg CO2 annually",
      icon: <Coffee />,
      helpful: 15,
      notHelpful: 4
    },
    {
      id: 6,
      title: "Smart Power Strips",
      description: "Use smart power strips at your workstation to eliminate phantom power draw from devices that are turned off but still plugged in. This can reduce standby power consumption by up to 10%.",
      category: "devices",
      potentialSavings: "10% standby power",
      icon: <Monitor />,
      helpful: 22,
      notHelpful: 3
    },
    {
      id: 7,
      title: "Schedule Large Tasks",
      description: "Schedule energy-intensive computing tasks like large renders, data processing, or backups during off-peak hours to reduce strain on the grid during peak demand times.",
      category: "devices",
      potentialSavings: "Grid load reduction",
      icon: <Clock />,
      helpful: 19,
      notHelpful: 6
    },
    {
      id: 8,
      title: "Indoor Plants",
      description: "Place air-purifying indoor plants around your workspace. They naturally filter air, improve air quality, and reduce the need for air purifiers which consume electricity.",
      category: "other",
      potentialSavings: "Air quality improvement",
      icon: <Leaf />,
      helpful: 29,
      notHelpful: 2
    }
  ]);
  
  // Vote handler
  const handleVote = (tipId: number, voteType: "helpful" | "notHelpful") => {
    setTips(prevTips => 
      prevTips.map(tip => {
        if (tip.id === tipId) {
          // If user already voted, remove previous vote
          if (tip.userVoted) {
            const updatedTip = {
              ...tip,
              [tip.userVoted]: tip[tip.userVoted] - 1,
            };
            
            // If clicking the same button, remove vote entirely
            if (tip.userVoted === voteType) {
              return { ...updatedTip, userVoted: undefined };
            }
            
            // Otherwise change vote
            return {
              ...updatedTip,
              [voteType]: updatedTip[voteType] + 1,
              userVoted: voteType
            };
          }
          
          // New vote
          return {
            ...tip,
            [voteType]: tip[voteType] + 1,
            userVoted: voteType
          };
        }
        return tip;
      })
    );
    
    toast({
      title: "Thanks for your feedback",
      description: "Your vote helps us improve our sustainability tips."
    });
  };

  // Filter tips based on active tab and search query
  const filteredTips = tips.filter(tip => {
    const matchesCategory = activeTab === "all" || tip.category === activeTab;
    const matchesSearch = 
      searchQuery === "" || 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Get category label for badge
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "devices": return "Devices";
      case "ac": return "Climate Control";
      case "lighting": return "Lighting";
      case "other": return "Lifestyle";
      default: return "General";
    }
  };
  
  // Get category color for badge
  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (category) {
      case "devices": return "default";
      case "ac": return "secondary";
      case "lighting": return "outline";
      case "other": return "default";
      default: return "outline";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sustainability Tips</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Practical ways to reduce energy consumption and make a positive impact
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Browse Tips</CardTitle>
              <div className="w-full sm:w-[300px]">
                <Input 
                  placeholder="Search tips..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Devices</span>
                </TabsTrigger>
                <TabsTrigger value="ac" className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  <span>Climate</span>
                </TabsTrigger>
                <TabsTrigger value="lighting" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Lighting</span>
                </TabsTrigger>
                <TabsTrigger value="other" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span>Lifestyle</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-0">
                {filteredTips.length > 0 ? (
                  filteredTips.map(tip => (
                    <Card key={tip.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-16 bg-primary/10 dark:bg-primary/5 flex items-center justify-center p-4">
                          <div className="text-primary">{tip.icon}</div>
                        </div>
                        <div className="flex-grow p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{tip.title}</h3>
                              <Badge variant={getCategoryColor(tip.category)} className="mt-1">
                                {getCategoryLabel(tip.category)}
                              </Badge>
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                              Saves: {tip.potentialSavings}
                            </div>
                          </div>
                          <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                            {tip.description}
                          </p>
                          <div className="flex items-center mt-4 space-x-4">
                            <Button 
                              variant={tip.userVoted === "helpful" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => handleVote(tip.id, "helpful")}
                              className="flex items-center gap-2"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>Helpful ({tip.helpful})</span>
                            </Button>
                            <Button 
                              variant={tip.userVoted === "notHelpful" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => handleVote(tip.id, "notHelpful")}
                              className="flex items-center gap-2"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span>Not Helpful ({tip.notHelpful})</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-500 dark:text-neutral-400">
                      No tips found matching your criteria. Try adjusting your search.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Own Tip</CardTitle>
            <CardDescription>
              Share your own energy-saving tips with colleagues to help create a more sustainable workplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tip-title" className="text-sm font-medium">
                    Tip Title
                  </label>
                  <Input id="tip-title" placeholder="A concise title for your tip" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="tip-category" className="text-sm font-medium">
                    Category
                  </label>
                  <select 
                    id="tip-category"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="devices">Devices</option>
                    <option value="ac">Climate Control</option>
                    <option value="lighting">Lighting</option>
                    <option value="other">Lifestyle</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tip-description" className="text-sm font-medium">
                  Description
                </label>
                <textarea 
                  id="tip-description" 
                  rows={4}
                  placeholder="Describe your sustainability tip in detail..."
                  className="w-full p-3 rounded-md border border-input bg-background resize-none"
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tip-savings" className="text-sm font-medium">
                  Potential Savings (if known)
                </label>
                <Input id="tip-savings" placeholder="e.g., 10% energy, 5 kWh per day, etc." />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                toast({
                  title: "Tip Submitted",
                  description: "Thank you for contributing to our sustainability efforts!",
                });
              }}
            >
              Submit Tip
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityTips;