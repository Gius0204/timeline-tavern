
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import Header from "@/components/layout/Header";
import ViewSelector, { ViewType } from "@/components/layout/ViewSelector";
import ProjectList from "@/components/projects/ProjectList";
import KanbanBoard from "@/components/projects/KanbanBoard";
import GanttView from "@/components/projects/GanttView";
import CalendarView from "@/components/projects/CalendarView";
import TimeSheet from "@/components/projects/TimeSheet";
import TaskModal from "@/components/projects/TaskModal";
import { Task } from "@/types";
import { ExternalLink, LinkIcon } from "lucide-react";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, setCurrentProject } = useProject();
  const [activeView, setActiveView] = useState<ViewType>("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  // If project doesn't exist, redirect to dashboard
  useEffect(() => {
    if (projectId && !projects.some(p => p.id === projectId)) {
      navigate("/dashboard");
    }
  }, [projectId, projects, navigate]);
  
  // Render the active view
  const renderActiveView = () => {
    switch (activeView) {
      case "list":
        return <ProjectList onTaskClick={handleTaskClick} />;
      case "status":
        return <KanbanBoard onTaskClick={handleTaskClick} />;
      case "gantt":
        return <GanttView onTaskClick={handleTaskClick} />;
      case "calendar":
        return <CalendarView onTaskClick={handleTaskClick} />;
      case "timesheet":
        return <TimeSheet />;
      default:
        return <ProjectList onTaskClick={handleTaskClick} />;
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header showViewSelector />
      <ViewSelector 
        activeView={activeView}
        onViewChange={setActiveView}
        className="animate-fade-in"
      />
      
      <main className="flex-1 overflow-hidden animate-fade-in">
        {renderActiveView()}
      </main>
      
      <TaskModal 
        task={selectedTask}
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
      />
    </div>
  );
};

export default ProjectDetails;
