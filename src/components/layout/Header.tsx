
import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Search, Bell, User, ChevronDown, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showViewSelector?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showViewSelector = false }) => {
  const { currentProject, users } = useProject();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-30 w-full">
      <div className="flex items-center gap-4">
        {currentProject && (
          <div>
            <h1 className="text-lg font-medium">{currentProject.name}</h1>
            <div className="text-xs text-muted-foreground">
              Due: {currentProject.dueDate?.toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-9 bg-muted/50 border-muted focus-visible:bg-background"
          />
        </div>

        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>

        <Button size="sm" variant="outline" className="hidden md:flex gap-1">
          <Calendar className="h-4 w-4" />
          <span>Today</span>
        </Button>

        <Button size="icon" variant="ghost" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 mt-1 p-2" align="end">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="justify-start h-9">
                <User className="mr-2 h-4 w-4" />
                Your Profile
              </Button>
              <Button variant="ghost" className="justify-start h-9">
                Settings
              </Button>
              <Button variant="ghost" className="justify-start h-9 text-red-500 hover:text-red-600 hover:bg-red-50">
                Sign Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
