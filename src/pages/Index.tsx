
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChartHorizontal, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Kanban, 
  ArrowRight,
  Users
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="h-6 w-6 text-hive-blue" />
            <span className="text-xl font-heading font-semibold">Timeline</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-muted-foreground">Dashboard</Button>
            </Link>
            <Link to="/projects/project1">
              <Button variant="ghost" className="text-muted-foreground">Demo Project</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container max-w-7xl mx-auto px-4 pt-12 md:pt-16 lg:pt-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-hive-blue/10 px-3 py-1 text-sm text-hive-blue">
              <span>Project Management Reimagined</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight animate-fade-in">
              Effortless Project Tracking & Collaboration
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              A beautiful, intuitive project management solution designed to help teams work together seamlessly. Visualize your workflow, track progress, and deliver results on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  <span>Try it now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/projects/project1">
                <Button size="lg" variant="outline">
                  View demo project
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-hive-blue/10 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-hive-purple/10 rounded-full filter blur-3xl opacity-70"></div>
            <div className="relative bg-white/70 backdrop-blur-sm border border-white/30 shadow-glass rounded-2xl overflow-hidden p-3 transform transition-all duration-500 hover:shadow-hover">
              <img 
                src="/lovable-uploads/a73b84d8-beb2-4bd6-829d-a66fb9846b63.png" 
                alt="Project dashboard" 
                className="rounded-xl border" 
              />
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-32 lg:mt-40">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4">
              Multiple ways to manage your projects
            </h2>
            <p className="text-muted-foreground">
              Choose the view that works best for your workflow and switch seamlessly between them.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: CheckSquare, 
                title: "List View", 
                description: "Traditional task list with sections, perfect for organizing your work." 
              },
              { 
                icon: Kanban, 
                title: "Kanban Board", 
                description: "Visualize work progress through customizable status columns." 
              },
              { 
                icon: BarChartHorizontal, 
                title: "Gantt Chart", 
                description: "Track project timelines, dependencies and critical paths." 
              },
              { 
                icon: Calendar, 
                title: "Calendar View", 
                description: "See your tasks in a calendar format to manage deadlines effectively." 
              },
              { 
                icon: Clock, 
                title: "Time Tracking", 
                description: "Monitor team workload and record time spent on tasks." 
              },
              { 
                icon: Users, 
                title: "Team Collaboration", 
                description: "Assign tasks, share notes, and collaborate in real-time." 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-card border rounded-xl p-6 transition-all duration-300 hover:shadow-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-hive-blue/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-hive-blue/20">
                  <feature.icon className="h-6 w-6 text-hive-blue" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="container max-w-7xl mx-auto px-4 py-12 mt-24 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Timeline</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Timeline. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
