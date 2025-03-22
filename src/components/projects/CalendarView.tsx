
import React, { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon
} from "lucide-react";

interface CalendarTaskProps {
  task: Task;
  onClick: (task: Task) => void;
}

const CalendarTask: React.FC<CalendarTaskProps> = ({ task, onClick }) => {
  let bgColor = "bg-hive-blue/10 text-hive-blue border-hive-blue/20";
  if (task.status === "completed") bgColor = "bg-hive-green/10 text-hive-green border-hive-green/20";
  if (task.status === "blocked") bgColor = "bg-hive-red/10 text-hive-red border-hive-red/20";
  if (task.status === "unstarted") bgColor = "bg-secondary text-muted-foreground border-border";
  
  return (
    <div 
      className={cn(
        "p-1 rounded text-xs mb-1 truncate border cursor-pointer",
        bgColor
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-center gap-1">
        <span className="truncate">{task.title}</span>
        
        {task.assignees.length > 0 && (
          <Avatar className="h-4 w-4 ml-auto">
            <AvatarImage src={task.assignees[0].avatar} alt={task.assignees[0].name} />
            <AvatarFallback className="text-[8px]">
              {task.assignees[0].name[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

interface CalendarViewProps {
  onTaskClick: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onTaskClick }) => {
  const { currentProject, getTasksForCalendar } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[][]>([]);
  
  // Generate calendar days when the month changes
  React.useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[][] = [];
    let week: Date[] = [];
    
    // Add days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      week.push(prevMonthDay);
    }
    
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      week.push(date);
      
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }
    
    // Add days from next month to fill the last week
    if (week.length > 0) {
      const daysToAdd = 7 - week.length;
      for (let i = 1; i <= daysToAdd; i++) {
        const nextMonthDay = new Date(year, month + 1, i);
        week.push(nextMonthDay);
      }
      days.push(week);
    }
    
    setCalendarDays(days);
  }, [currentDate]);
  
  const previousMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(date);
  };
  
  const nextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date);
  };
  
  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  if (!currentProject) return <div>No project selected</div>;
  
  // Get start and end date for the entire calendar view
  const startDate = calendarDays[0]?.[0];
  const endDate = calendarDays[calendarDays.length - 1]?.[6];
  
  const tasks = startDate && endDate 
    ? getTasksForCalendar(currentProject.id, startDate, endDate)
    : [];
  
  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach(task => {
    if (task.startDate) {
      const dateStr = task.startDate.toDateString();
      if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
      tasksByDate[dateStr].push(task);
    }
  });
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{formatMonthYear()}</span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="text-center py-2 text-sm font-medium">
              {day}
            </div>
          ))}
          
          {/* Calendar grid */}
          {calendarDays.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const dateStr = day.toDateString();
              const dayTasks = tasksByDate[dateStr] || [];
              
              return (
                <div 
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    "border rounded p-1 h-32 overflow-y-auto",
                    isCurrentMonth ? "bg-background" : "bg-muted/30",
                    isToday && "border-hive-blue/50 bg-hive-blue/5"
                  )}
                >
                  <div className={cn(
                    "text-right text-sm font-medium mb-1",
                    !isCurrentMonth && "text-muted-foreground"
                  )}>
                    {day.getDate()}
                  </div>
                  
                  {dayTasks.map(task => (
                    <CalendarTask 
                      key={task.id} 
                      task={task} 
                      onClick={onTaskClick} 
                    />
                  ))}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
