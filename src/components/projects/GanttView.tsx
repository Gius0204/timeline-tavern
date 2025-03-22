
import React, { useState, useRef, useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface GanttTaskProps {
  task: Task;
  dates: Date[];
  onTaskClick: (task: Task) => void;
}

const GanttTask: React.FC<GanttTaskProps> = ({ task, dates, onTaskClick }) => {
  if (!task.startDate || !task.dueDate) return null;
  
  // Calculate position and width based on start and end dates
  const startIdx = dates.findIndex(date => 
    date.toDateString() === task.startDate!.toDateString()
  );
  
  const endIdx = dates.findIndex(date => 
    date.toDateString() === task.dueDate!.toDateString()
  );
  
  if (startIdx === -1 || endIdx === -1) return null;
  
  const left = `${startIdx * 40}px`;
  const width = `${(endIdx - startIdx + 1) * 40}px`;
  
  // Determine color based on status
  let bgColor = "bg-hive-blue";
  if (task.status === "completed") bgColor = "bg-hive-green";
  if (task.status === "blocked") bgColor = "bg-hive-red";
  
  return (
    <div 
      className={cn(
        "gantt-bar flex items-center justify-between px-2 text-white text-sm font-medium cursor-pointer",
        bgColor
      )}
      style={{ left, width }}
      onClick={() => onTaskClick(task)}
    >
      <span className="truncate">{task.title}</span>
      
      {task.assignees.length > 0 && (
        <Avatar className="h-5 w-5 border border-white/30">
          <AvatarImage src={task.assignees[0].avatar} alt={task.assignees[0].name} />
          <AvatarFallback className="text-xs">
            {task.assignees[0].name[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

interface GanttViewProps {
  onTaskClick: (task: Task) => void;
}

const GanttView: React.FC<GanttViewProps> = ({ onTaskClick }) => {
  const { currentProject, getTasksForGantt, addTask } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate dates for the visible range (30 days)
  useEffect(() => {
    const newDates: Date[] = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 5); // Show 5 days before
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      newDates.push(date);
    }
    
    setDates(newDates);
  }, [currentDate]);
  
  // Scroll to today on initial render
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 5 * 40; // 5 days * 40px
    }
  }, []);
  
  if (!currentProject) return <div>No project selected</div>;
  
  const tasks = getTasksForGantt(currentProject.id);
  
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  const handleAddTask = () => {
    // Get the first section of the project
    const firstSection = currentProject.sections[0];
    if (!firstSection) return;
    
    // Set default dates to today and a week from today
    const today = new Date();
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    
    addTask({
      title: "New action",
      status: "unstarted",
      section: firstSection.id,
      assignees: [],
      startDate: today,
      dueDate: weekLater,
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {dates[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
            {dates[dates.length - 1]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        
        <Button size="sm" onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-1" />
          Add an action
        </Button>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-auto" ref={scrollContainerRef}>
        <div className="inline-flex">
          {/* Project/Task labels */}
          <div className="sticky left-0 bg-background z-10 border-r w-48">
            <div className="h-10 border-b flex items-center px-3 font-medium bg-muted/50">
              Project/Action
            </div>
            <div>
              <div className="h-10 border-b flex items-center px-3 font-medium">
                {currentProject.name}
              </div>
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="h-10 border-b flex items-center px-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
          
          {/* Timeline grid */}
          <div className="relative">
            {/* Date headers */}
            <div className="flex h-10 border-b">
              {dates.map((date, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-10 flex-shrink-0 flex flex-col items-center justify-center text-xs border-r",
                    date.getDay() === 0 || date.getDay() === 6 ? "bg-muted/50" : "",
                    date.toDateString() === new Date().toDateString() ? "bg-hive-blue/10" : ""
                  )}
                >
                  <div>{date.getDate()}</div>
                  <div className="text-muted-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Project timeline row */}
            <div className="relative h-10 border-b">
              {currentProject.dueDate && (
                <div 
                  className="absolute top-0 h-full border-r border-hive-red"
                  style={{ 
                    left: `${dates.findIndex(d => 
                      d.toDateString() === currentProject.dueDate!.toDateString()
                    ) * 40}px` 
                  }}
                >
                  <div className="px-1 bg-hive-red text-white text-xs whitespace-nowrap transform -translate-x-full">
                    Due: {currentProject.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tasks timeline rows */}
            {tasks.map((task) => (
              <div key={task.id} className="relative h-10 border-b">
                <GanttTask task={task} dates={dates} onTaskClick={onTaskClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttView;
