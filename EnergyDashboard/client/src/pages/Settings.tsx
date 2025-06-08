import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Bell, Shield, Zap, Database, Monitor } from "lucide-react";

// Settings form interface
interface ProfileFormValues {
  name: string;
  email: string;
  department: string;
  bio: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      name: "Emma Thompson",
      email: "ethompson@example.com",
      department: "Sustainability Manager",
      bio: "Leading our company's sustainability and energy conservation initiatives."
    }
  });
  
  // Submit handlers
  const onProfileSubmit = (data: ProfileFormValues) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    console.log(data);
  };
  
  const onSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const onSaveDisplaySettings = () => {
    toast({
      title: "Display Settings Saved",
      description: "Your display preferences have been updated.",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Monitor className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Display</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          This email will be used for notifications and communications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Product Design">Product Design</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Customer Success">Customer Success</SelectItem>
                            <SelectItem value="Sustainability Manager">Sustainability Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief description visible on your profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about energy usage and system updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="energy-alerts">Energy Usage Alerts</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Receive alerts when energy usage exceeds normal levels
                    </p>
                  </div>
                  <Switch id="energy-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Energy Reports</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Weekly summary of your department's energy usage
                    </p>
                  </div>
                  <Switch id="weekly-report" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-recommendations">New Recommendations</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Get notified when new energy-saving recommendations are available
                    </p>
                  </div>
                  <Switch id="new-recommendations" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Notifications when you earn new Awe Points or reach milestones
                    </p>
                  </div>
                  <Switch id="achievement-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-updates">System Updates</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Notifications about dashboard updates and new features
                    </p>
                  </div>
                  <Switch id="system-updates" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onSaveNotifications}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how the dashboard looks and displays information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 cursor-pointer border-primary">
                    <div className="h-10 bg-white dark:bg-gray-950 rounded-md mb-2"></div>
                    <Label>Light Mode</Label>
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer">
                    <div className="h-10 bg-gray-900 rounded-md mb-2"></div>
                    <Label>Dark Mode</Label>
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer">
                    <div className="h-10 bg-gradient-to-r from-white to-gray-900 rounded-md mb-2"></div>
                    <Label>System Default</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Layout</h3>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default View</Label>
                  <Select defaultValue="energy">
                    <SelectTrigger id="default-view">
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy">Energy Overview</SelectItem>
                      <SelectItem value="co2">CO2 Emissions</SelectItem>
                      <SelectItem value="recommendations">Recommendations</SelectItem>
                      <SelectItem value="leaderboard">Employee Leaderboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Display</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-charts">Compact Charts</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Display charts in a more compact format
                      </p>
                    </div>
                    <Switch id="compact-charts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-tooltips">Enhanced Tooltips</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Show detailed information in chart tooltips
                      </p>
                    </div>
                    <Switch id="show-tooltips" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onSaveDisplaySettings}>Save Display Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure system behavior and data handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Settings</h3>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Allow anonymous usage data to be shared for sustainability research
                    </p>
                  </div>
                  <Switch id="data-sharing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-retention">Extended Data Retention</Label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Store historical energy data for up to 2 years (default is 6 months)
                    </p>
                  </div>
                  <Switch id="data-retention" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Integration Settings</h3>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly />
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Use this key to access the Energy Dashboard API
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhooks">Webhook URL</Label>
                  <Input id="webhooks" placeholder="https://your-server.com/webhook" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Receive real-time updates via webhook
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <Separator className="border-red-200 dark:border-red-900" />
                <div className="rounded-md border border-red-200 dark:border-red-900 p-4">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Reset Dashboard</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-4">
                    This will reset all your dashboard settings and preferences to default values.
                    Your historical data will remain intact.
                  </p>
                  <Button variant="destructive" size="sm">
                    Reset to Default
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Advanced Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;