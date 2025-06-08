import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Mail, MessageSquare, BookOpen, Video, FileText } from "lucide-react";

const Help = () => {
  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Help Center</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Resources and assistance for using the energy dashboard
        </p>
      </div>

      {/* Help content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-border">
              <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How is energy consumption calculated?</AccordionTrigger>
                  <AccordionContent>
                    Energy consumption is calculated using IoT sensors placed throughout the office that monitor 
                    electricity usage for lighting, air conditioning, and electronic devices. These measurements 
                    are collected in real-time and aggregated to provide the dashboard visualizations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What are Awe Points and how do I earn them?</AccordionTrigger>
                  <AccordionContent>
                    Awe Points are rewards earned through eco-friendly behaviors. You can earn points by:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Using dark mode on your devices (8 points per day)</li>
                      <li>Proper power management of your workstation (15 points per day)</li>
                      <li>Sitting in energy-optimized zones (12 points per day)</li>
                      <li>Applying AI recommendations (varies by recommendation)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How accurate are the AI recommendations?</AccordionTrigger>
                  <AccordionContent>
                    AI recommendations are based on analysis of your office's actual energy usage patterns 
                    and are typically 85-95% accurate. The system uses machine learning to identify optimization 
                    opportunities and improves over time as it learns from the specific patterns in your workplace.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I export data from the dashboard?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export data in CSV, Excel, or PDF formats from most dashboard pages. Look for 
                    the export button in the top-right corner of each chart or table. For more comprehensive 
                    data exports, please contact your sustainability manager.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How can I contribute to improving our office sustainability?</AccordionTrigger>
                  <AccordionContent>
                    Beyond following the AI recommendations, you can:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Submit your own energy-saving ideas through the feedback form</li>
                      <li>Participate in monthly sustainability challenges</li>
                      <li>Join the office sustainability committee</li>
                      <li>Share successful practices with colleagues</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border">
              <h2 className="text-lg font-semibold">Video Tutorials</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-neutral-100 dark:bg-neutral-800 aspect-video flex items-center justify-center">
                    <Video className="h-12 w-12 text-neutral-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Dashboard Overview</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      Learn how to navigate and interpret the main dashboard metrics
                    </p>
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-neutral-100 dark:bg-neutral-800 aspect-video flex items-center justify-center">
                    <Video className="h-12 w-12 text-neutral-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Understanding Analytics</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      Deep dive into energy analytics and reporting features
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-border">
              <h3 className="text-base font-medium">Contact Support</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      support@ecotrack.example
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary flex items-center justify-center mr-3">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Available 9am-5pm Mon-Fri
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <Button className="w-full">
                Contact Support Team
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border">
              <h3 className="text-base font-medium">Documentation</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>User Guide</span>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>API Documentation</span>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Troubleshooting Guide</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;