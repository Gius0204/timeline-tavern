
import React, { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Task, Status } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Calendar, MoreHorizontal } from "lucide-react";

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  count: number;
  color: string;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: Status) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  count,
  color,
  onTaskClick,
  onAddTask
}) => {
  const columnColorStyle = {
    borderTop: `3px solid ${color}`,
    '--status-color': color
  } as React.CSSProperties;
  
  return (
    <div 
      className="kanban-column flex-shrink-0 flex flex-col bg-background rounded-md shadow-subtle overflow-hidden"
      style={columnColorStyle}
    >
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          <Badge variant="outline" className="bg-secondary px-1.5 py-0 h-5">
            {count}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start h-9 border border-dashed border-muted hover:border-muted-foreground/50"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create new action
        </Button>
        
        {tasks.length === 0 && (
          <div className="text-muted-foreground text-sm text-center py-4 italic">
            Nothing here yet.
          </div>
        )}
        
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="task-card p-3 bg-card rounded-md border shadow-sm hover:shadow-hover cursor-pointer transition-all"
            onClick={() => onTaskClick(task)}
          >
            <div className="font-medium mb-2">{task.title}</div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {task.startDate && task.dueDate && (
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {task.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
              
              {task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.map((assignee, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AddColumnButtonProps {
  onClick: () => void;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onClick }) => (
  <div className="kanban-column flex-shrink-0 flex flex-col h-full">
    <Button 
      variant="outline" 
      className="w-full h-full border border-dashed border-muted flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 hover:bg-secondary/50"
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
      <span>Add a new status</span>
    </Button>
  </div>
);

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
  const { currentProject, getTasksByStatus, addTask, addStatusColumn } = useProject();
  
  if (!currentProject) return <div>No project selected</div>;
  
  const tasksByStatus = getTasksByStatus(currentProject.id);
  
  const handleAddTask = (status: Status) => {
    // Get the first section of the project (we need to specify a section)
    const firstSection = currentProject.sections[0];
    if (!firstSection) return;
    
    addTask({
      title: "New action",
      status,
      section: firstSection.id,
      assignees: [],
    });
  };
  
  const handleAddColumn = () => {
    const name = prompt("Enter status name");
    if (name && currentProject) {
      addStatusColumn(currentProject.id, name, "#94a3b8"); // Default color
    }
  };
  
  return (
    <div className="h-full overflow-x-auto">
      <div className="flex h-full gap-4 p-4">
        {currentProject.statusColumns
          .sort((a, b) => a.order - b.order)
          .map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.name}
              status={column.name}
              tasks={tasksByStatus[column.name] || []}
              count={tasksByStatus[column.name]?.length || 0}
              color={column.color}
              onTaskClick={onTaskClick}
              onAddTask={handleAddTask}
            />
          ))}
        
        <AddColumnButton onClick={handleAddColumn} />
      </div>
    </div>
  );
};

export default KanbanBoard;
