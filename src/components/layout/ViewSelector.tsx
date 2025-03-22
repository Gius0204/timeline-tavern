
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ListTodo, 
  Kanban, 
  BarChartHorizontal, 
  Calendar as CalendarIcon,
  Table, 
  Clock, 
  Cog,
  Plus,
} from "lucide-react";

export type ViewType = 
  | "list" 
  | "status" 
  | "gantt" 
  | "calendar" 
  | "table" 
  | "timesheet";

interface ViewSelectorProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ 
  activeView, 
  onViewChange,
  className,
}) => {
  // Define all available views with their icons
  const views = [
    { id: "list" as ViewType, label: "List", icon: ListTodo },
    { id: "status" as ViewType, label: "Status", icon: Kanban },
    { id: "gantt" as ViewType, label: "Gantt", icon: BarChartHorizontal },
    { id: "calendar" as ViewType, label: "Calendar", icon: CalendarIcon },
    { id: "table" as ViewType, label: "Table", icon: Table },
    { id: "timesheet" as ViewType, label: "Timesheet", icon: Clock },
  ];

  return (
    <div className={cn("flex items-center justify-between border-b border-border px-1", className)}>
      <Tabs value={activeView} onValueChange={(v) => onViewChange(v as ViewType)}>
        <TabsList className="bg-transparent h-11">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <TabsTrigger 
                key={view.id} 
                value={view.id}
                className={cn(
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 py-2",
                  "gap-2 transition-all"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{view.label}</span>
              </TabsTrigger>
            );
          })}
          <Button variant="ghost" size="icon" className="h-9 w-9 ml-1">
            <Plus className="h-4 w-4" />
          </Button>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 pr-2">
        <Button variant="ghost" size="sm">
          Save
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <Cog className="h-4 w-4" />
          <span className="hidden sm:inline-block">Configure</span>
        </Button>
      </div>
    </div>
  );
};

export default ViewSelector;
