
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { Link } from "react-router-dom";
import { PlusCircle, Calendar, CheckCircle, Layers, Users, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const { projects, groups } = useProject();
  
  const totalTasks = projects.reduce((total, project) => {
    return total + project.sections.reduce((sectionTotal, section) => {
      return sectionTotal + section.tasks.length;
    }, 0);
  }, 0);
  
  const completedTasks = projects.reduce((total, project) => {
    return total + project.sections.reduce((sectionTotal, section) => {
      return sectionTotal + section.tasks.filter(task => task.status === "completed").length;
    }, 0);
  }, 0);
  
  const calculateCompletionPercentage = () => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  const upcomingDeadlines = projects
    .filter(project => project.dueDate && project.dueDate > new Date())
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    })
    .slice(0, 3);
  
  return (
    <div className="container max-w-7xl py-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your projects and tasks
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {groups.length} groups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed ({calculateCompletionPercentage()}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDeadlines.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingDeadlines[0]?.dueDate?.toLocaleDateString() || "None"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Working on {projects.length} projects
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </div>
            <CardDescription>
              Your most recently accessed projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="text-xs text-muted-foreground">
                      {project.sections.reduce((total, section) => total + section.tasks.length, 0)} tasks
                    </div>
                  </div>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Projects with approaching due dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Due: {project.dueDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Time Allocation</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Clock className="h-4 w-4" />
                <span>Timesheet</span>
              </Button>
            </div>
            <CardDescription>
              Time spent on projects this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Time tracking data will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
