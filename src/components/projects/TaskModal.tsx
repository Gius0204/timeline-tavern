
import React, { useState } from "react";
import { Task, User, SubTask } from "@/types";
import { useProject } from "@/contexts/ProjectContext";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TaskEditor } from "./TaskEditor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Clock,
  File,
  Link2,
  MoreHorizontal,
  Paperclip,
  Plus,
  MessageSquare,
  Archive,
  Trash2,
  Share2
} from "lucide-react";

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  task, 
  open, 
  onOpenChange 
}) => {
  const { users, updateTask, deleteTask } = useProject();
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  if (!task || !editedTask) return null;
  
  const handleUpdate = () => {
    if (editedTask) {
      updateTask(editedTask);
      onOpenChange(false);
    }
  };
  
  const handleDelete = () => {
    if (editedTask) {
      deleteTask(editedTask.id);
      onOpenChange(false);
    }
  };
  
  const updateField = <K extends keyof Task>(field: K, value: Task[K]) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        [field]: value
      });
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('title', e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField('description', e.target.value);
  };
  
  const handleStatusChange = (status: string) => {
    updateField('status', status);
  };
  
  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'dueDate') => {
    if (date) {
      updateField(field, date);
    }
  };
  
  const assignUser = (user: User) => {
    if (editedTask) {
      const isAssigned = editedTask.assignees.some(a => a.id === user.id);
      
      if (isAssigned) {
        updateField(
          'assignees',
          editedTask.assignees.filter(a => a.id !== user.id)
        );
      } else {
        updateField('assignees', [...editedTask.assignees, user]);
      }
    }
  };
  
  const toggleSubTask = (subTaskId: string) => {
    if (editedTask && editedTask.subTasks) {
      const updatedSubTasks = editedTask.subTasks.map(st => 
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      );
      updateField('subTasks', updatedSubTasks);
    }
  };
  
  const addSubTask = (title: string) => {
    if (editedTask) {
      const newSubTask: SubTask = {
        id: `subtask${Date.now()}`,
        title,
        completed: false,
      };
      updateField('subTasks', [...(editedTask.subTasks || []), newSubTask]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <Input 
              value={editedTask.title}
              onChange={handleTitleChange}
              className="text-xl font-medium border-0 h-auto px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Task title"
            />
            
            <div className="flex items-center gap-2">
              <Button onClick={handleUpdate} size="sm" variant="secondary">
                Save
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Archive className="h-4 w-4" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="gap-2 text-red-500 focus:text-red-500"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-[1fr_280px] divide-x h-full">
          <div className="px-4 py-2 space-y-6">
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <Textarea 
                value={editedTask.description || ''}
                onChange={handleDescriptionChange}
                placeholder="Add description"
                className="mt-1 h-24 resize-none"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Subactions</Label>
              </div>
              <div className="space-y-2">
                {editedTask.subTasks?.map(subTask => (
                  <div 
                    key={subTask.id}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    <input 
                      type="checkbox" 
                      checked={subTask.completed}
                      onChange={() => toggleSubTask(subTask.id)}
                      className="h-4 w-4"
                    />
                    <span className={cn(
                      subTask.completed && "line-through text-muted-foreground"
                    )}>
                      {subTask.title}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="gap-1 text-muted-foreground"
                    onClick={() => {
                      const title = prompt('Enter subaction title');
                      if (title) addSubTask(title);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>New subaction</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Dependencies</Label>
              {editedTask.dependencies && editedTask.dependencies.length > 0 ? (
                <div className="mt-1 space-y-2">
                  {editedTask.dependencies.map((depId, i) => (
                    <div key={i} className="p-2 bg-orange-50 border border-orange-200 rounded-md text-orange-700 text-sm">
                      Action 2 is waiting on this
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground mt-1">
                  No dependencies
                </div>
              )}
              <Button variant="ghost" size="sm" className="gap-1 mt-2">
                <Plus className="h-4 w-4" />
                <span>Add dependency</span>
              </Button>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Attachments</Label>
              <Button variant="ghost" size="sm" className="gap-1 mt-1">
                <Paperclip className="h-4 w-4" />
                <span>Add attachment</span>
              </Button>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Notes</Label>
              <div className="mt-1 border rounded-lg overflow-hidden">
                <TaskEditor />
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Comments</Label>
              <div className="p-4 text-center border rounded-md mt-1">
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mt-2">
                  No comments yet
                </p>
                <Textarea 
                  placeholder="Add a comment..." 
                  className="mt-4"
                />
                <Button size="sm" className="ml-auto mt-2">Post</Button>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-2 space-y-6">
            <div>
              <Label className="text-sm text-muted-foreground">Assignee</Label>
              <div className="mt-1">
                {editedTask.assignees.length > 0 ? (
                  <div className="space-y-2">
                    {editedTask.assignees.map(assignee => (
                      <div 
                        key={assignee.id}
                        className="flex items-center justify-between p-2 bg-secondary rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatar} alt={assignee.name} />
                            <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{assignee.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => assignUser(assignee)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No assignees
                  </div>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 mt-2 w-full justify-start"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Assign to</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {users.map(user => (
                      <DropdownMenuItem 
                        key={user.id}
                        onClick={() => assignUser(user)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                          {editedTask.assignees.some(a => a.id === user.id) && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Dates</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editedTask.startDate && editedTask.dueDate ? (
                          <span>
                            {format(editedTask.startDate, "MMM d")} - {format(editedTask.dueDate, "MMM d")}
                          </span>
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <div className="space-y-2">
                          <div>
                            <Label>Start date</Label>
                            <div className="pt-1 pb-2">
                              <Calendar
                                mode="single"
                                selected={editedTask.startDate}
                                onSelect={(date) => handleDateChange(date, 'startDate')}
                                className="p-0 rounded-md border shadow-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Due date</Label>
                            <div className="pt-1 pb-2">
                              <Calendar
                                mode="single"
                                selected={editedTask.dueDate}
                                onSelect={(date) => handleDateChange(date, 'dueDate')}
                                className="p-0 rounded-md border shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-2"
                          onClick={() => setShowDatePicker(false)}
                        >
                          Done
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button variant="outline" size="sm" className="gap-1 w-full justify-start">
                  <Clock className="h-4 w-4" />
                  <span>Schedule time</span>
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="mt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          editedTask.status === "in-progress" && "bg-hive-purple",
                          editedTask.status === "completed" && "bg-hive-green",
                          editedTask.status === "blocked" && "bg-hive-red",
                          editedTask.status === "unstarted" && "bg-hive-gray",
                        )} />
                        <span className="capitalize">{editedTask.status}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange('unstarted')}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-hive-gray" />
                        <span>Unstarted</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-hive-purple" />
                        <span>In Progress</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-hive-green" />
                        <span>Completed</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('blocked')}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-hive-red" />
                        <span>Blocked</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Labels</Label>
              <Button variant="outline" size="sm" className="gap-1 w-full justify-start mt-1">
                <Plus className="h-4 w-4" />
                <span>Add label</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
