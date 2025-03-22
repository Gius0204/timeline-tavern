
import React, { useState, useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  User, 
  Filter,
  X
} from "lucide-react";

const TimeSheet: React.FC = () => {
  const { users, getUserWorkloads } = useProject();
  const [startDate, setStartDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const [showSidePanel, setShowSidePanel] = useState(false);
  
  // Generate dates for the visible range (4 weeks)
  useEffect(() => {
    const newDates: Date[] = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    for (let i = 0; i < 28; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      newDates.push(date);
    }
    
    setDates(newDates);
  }, [startDate]);
  
  // Get workload data
  const endDate = new Date(dates[dates.length - 1]);
  const workloads = getUserWorkloads(dates[0], endDate);
  
  const navigatePrevious = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };
  
  const handleCellValueChange = (userId: string, dateStr: string, value: string) => {
    const hours = parseFloat(value);
    if (isNaN(hours)) return;
    
    // This would be implemented with addTimeEntry in a real app
    console.log('Update time entry:', userId, dateStr, hours);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-3 flex items-center justify-between">
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
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowSidePanel(!showSidePanel)}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Users column */}
          <div className="sticky left-0 bg-background z-10 border-r">
            <div className="h-10 border-b flex items-center px-3 font-medium bg-muted/50 w-48">
              <User className="h-4 w-4 mr-2" />
              <span>Team members</span>
            </div>
            
            {users.map((user) => (
              <div 
                key={user.id} 
                className="h-12 border-b flex items-center px-3 w-48"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.name[0]}</span>
                    )}
                  </div>
                  <span className="truncate">{user.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Timesheet grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col min-w-full">
              {/* Date headers */}
              <div className="flex h-10 border-b">
                {dates.map((date, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-16 flex-shrink-0 flex flex-col items-center justify-center text-xs border-r",
                      date.getDay() === 0 || date.getDay() === 6 ? "bg-muted/50" : "",
                      date.toDateString() === new Date().toDateString() ? "bg-hive-blue/10" : ""
                    )}
                  >
                    <div className="font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div>{date.getDate()}</div>
                  </div>
                ))}
              </div>
              
              {/* Hours rows */}
              {users.map((user) => (
                <div key={user.id} className="flex h-12 border-b">
                  {dates.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const hours = workloads[user.id]?.[dateStr] || 0;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    // Determine if the workload is too high (over 8 hours)
                    const isOverloaded = hours > 8;
                    
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "w-16 flex-shrink-0 border-r p-1 flex items-center justify-center",
                          isWeekend ? "bg-muted/30" : "",
                          isOverloaded ? "bg-hive-red/10" : ""
                        )}
                      >
                        <Input 
                          type="text" 
                          value={hours > 0 ? hours : ''} 
                          placeholder="0"
                          className={cn(
                            "h-8 text-center",
                            isOverloaded ? "text-hive-red" : ""
                          )}
                          onChange={(e) => handleCellValueChange(user.id, dateStr, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Side panel for filters */}
      {showSidePanel && (
        <div className="absolute top-0 right-0 h-full w-64 border-l bg-background shadow-md z-20 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setShowSidePanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex items-center gap-2">
                <Input type="date" />
                <span>to</span>
                <Input type="date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Members</label>
              {users.map((user) => (
                <div key={user.id} className="flex items-center">
                  <input type="checkbox" id={user.id} className="mr-2" defaultChecked />
                  <label htmlFor={user.id}>{user.name}</label>
                </div>
              ))}
            </div>
            
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSheet;
