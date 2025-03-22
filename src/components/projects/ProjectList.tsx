
import React, { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, User, Section } from "@/types";

interface SectionHeaderProps {
  name: string;
  taskCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  name, 
  taskCount, 
  isExpanded, 
  onToggle 
}) => (
  <div className="group flex items-center px-2 py-2 hover:bg-secondary/50 rounded-md transition-colors">
    <button 
      onClick={onToggle} 
      className="flex items-center gap-2 w-full"
    >
      {isExpanded ? (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="font-medium">{name}</span>
      <Badge variant="outline" className="ml-2 bg-secondary px-1.5 py-0 h-5">
        {taskCount}
      </Badge>
    </button>
    
    <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

interface TaskItemProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskClick }) => (
  <div 
    className="group flex items-center px-2 py-2 pl-8 hover:bg-secondary/50 rounded-md cursor-pointer transition-colors task-card"
    onClick={() => onTaskClick(task)}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          task.status === "in-progress" && "bg-hive-purple",
          task.status === "completed" && "bg-hive-green",
          task.status === "blocked" && "bg-hive-red",
          task.status === "unstarted" && "bg-hive-gray",
        )} />
        <span className="truncate">{task.title}</span>
      </div>
    </div>
    
    <div className="flex items-center gap-3 text-muted-foreground text-sm">
      <div className="flex -space-x-2">
        {task.assignees.map((assignee, i) => (
          <Avatar key={i} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback>{assignee.name[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      {task.startDate && task.dueDate && (
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          <span>
            {task.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
            {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      )}
      
      <Badge 
        className={cn(
          "px-2 py-0 h-5 text-xs font-normal capitalize",
          task.status === "in-progress" && "bg-hive-purple/10 text-hive-purple border-hive-purple/20",
          task.status === "completed" && "bg-hive-green/10 text-hive-green border-hive-green/20",
          task.status === "blocked" && "bg-hive-red/10 text-hive-red border-hive-red/20",
          task.status === "unstarted" && "bg-secondary text-muted-foreground",
        )}
      >
        {task.status}
      </Badge>
    </div>
  </div>
);

interface AddTaskButtonProps {
  sectionId: string;
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ sectionId, onClick }) => (
  <Button 
    variant="ghost" 
    className="w-full justify-start pl-8 text-muted-foreground hover:text-foreground h-9"
    onClick={onClick}
  >
    <Plus className="h-4 w-4 mr-2" />
    Create new action
  </Button>
);

const ProjectListHeader: React.FC = () => (
  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-3 py-2 border-b text-sm text-muted-foreground">
    <div>Name</div>
    <div>Assignees</div>
    <div>Start date</div>
    <div>Due date</div>
    <div>Status</div>
  </div>
);

interface ProjectListProps {
  onTaskClick: (task: Task) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onTaskClick }) => {
  const { currentProject, addTask } = useProject();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  if (!currentProject) return <div>No project selected</div>;
  
  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const handleAddTask = (sectionId: string) => {
    addTask({
      title: "New action",
      status: "unstarted",
      section: sectionId,
      assignees: [],
    });
  };

  const handleAddSection = () => {
    const name = prompt("Enter section name");
    if (name && currentProject) {
      // Use the addSection function from the context
      // This is handled in the ProjectContext
    }
  };
  
  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <ProjectListHeader />
      
      <div className="flex-1 overflow-y-auto py-2">
        {currentProject.sections.map((section) => (
          <div key={section.id} className="mb-2">
            <SectionHeader 
              name={section.name} 
              taskCount={section.tasks.length}
              isExpanded={expandedSections[section.id] !== false} // Default to expanded
              onToggle={() => handleSectionToggle(section.id)}
            />
            
            {expandedSections[section.id] !== false && (
              <div className="mt-1 space-y-1">
                {section.tasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onTaskClick={onTaskClick}
                  />
                ))}
                <AddTaskButton 
                  sectionId={section.id}
                  onClick={() => handleAddTask(section.id)}
                />
              </div>
            )}
          </div>
        ))}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground mt-2 h-9"
          onClick={handleAddSection}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create new section
        </Button>
      </div>
    </div>
  );
};

export default ProjectList;
