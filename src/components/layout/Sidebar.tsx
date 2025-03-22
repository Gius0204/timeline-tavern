
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Plus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NavItem = ({ 
  children, 
  to, 
  icon: Icon, 
  isActive = false 
}: { 
  children: React.ReactNode; 
  to: string; 
  icon: React.ElementType; 
  isActive?: boolean;
}) => (
  <Link to={to} className="w-full">
    <Button 
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground py-2 px-3 h-9 transition-all",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{children}</span>
    </Button>
  </Link>
);

const NavGroup = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon: Icon,
  count
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  icon?: React.ElementType;
  count?: number;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between text-sidebar-foreground hover:text-sidebar-accent-foreground py-1.5 px-3 transition-colors",
          isOpen && "font-medium"
        )}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span className="text-sm">{title}</span>
          {count !== undefined && (
            <span className="text-xs text-sidebar-foreground/70">{count}</span>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      
      <div className={cn("space-y-1 pl-3", !isOpen && "hidden")}>
        {children}
      </div>
    </div>
  );
};

const NavAction = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground py-1 px-3 transition-colors"
  >
    <Plus className="h-3 w-3" />
    <span>{children}</span>
  </button>
);

const ProjectItem = ({ 
  id, 
  name,
  isActive 
}: { 
  id: string; 
  name: string;
  isActive: boolean;
}) => (
  <Link to={`/projects/${id}`} className="w-full">
    <div 
      className={cn(
        "flex items-center gap-2 pl-4 py-1.5 hover:bg-sidebar-accent rounded-sm text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors",
        isActive && "bg-sidebar-accent/50 text-sidebar-accent-foreground"
      )}
    >
      <div className="w-2 h-2 rounded-sm bg-hive-green" />
      <span className="truncate">{name}</span>
    </div>
  </Link>
);

const Sidebar = () => {
  const { projects, groups, addProject, addGroup } = useProject();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActiveProject = (id: string) => {
    return location.pathname.includes(`/projects/${id}`);
  };

  const handleAddProject = () => {
    const name = prompt("Enter project name");
    if (name) {
      addProject({ name });
    }
  };

  const handleAddGroup = () => {
    const name = prompt("Enter group name");
    if (name) {
      addGroup(name);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col h-screen transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <FolderKanban className="h-6 w-6 text-hive-blue" />
            <span className="text-xl font-heading font-semibold">Timeline</span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 py-2 overflow-y-auto">
          <nav className="space-y-1 px-2">
            <NavItem to="/" icon={Home} isActive={location.pathname === "/"}>
              Home
            </NavItem>
            <NavItem to="/dashboard" icon={LayoutDashboard} isActive={location.pathname === "/dashboard"}>
              Dashboard
            </NavItem>
            
            <Separator className="my-3 bg-sidebar-border" />
            
            <NavGroup 
              title="Projects" 
              icon={FolderKanban}
              defaultOpen={true} 
              count={projects.length}
            >
              {projects.map((project) => (
                <ProjectItem 
                  key={project.id} 
                  id={project.id} 
                  name={project.name} 
                  isActive={isActiveProject(project.id)}
                />
              ))}
              <NavAction onClick={handleAddProject}>
                Add project
              </NavAction>
            </NavGroup>
            
            <NavGroup 
              title="Groups" 
              icon={Users}
              defaultOpen={true} 
              count={groups.length}
            >
              {groups.map((group) => (
                <div 
                  key={group.id}
                  className="pl-4 py-1.5 text-sm text-sidebar-foreground"
                >
                  {group.name}
                </div>
              ))}
              <NavAction onClick={handleAddGroup}>
                Add group
              </NavAction>
            </NavGroup>
          </nav>
        </div>
        
        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-sidebar-foreground">Team Workspace</div>
              <div className="text-xs text-sidebar-foreground/70">3 members</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
