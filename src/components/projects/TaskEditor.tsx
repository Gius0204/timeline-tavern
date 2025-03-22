
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Link,
  Table,
  Plus,
  FileText,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const TaskEditor: React.FC = () => {
  const [content, setContent] = useState("");
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const formatText = (format: string) => {
    // In a real app, this would format the text based on the selected format
    console.log('Format text:', format);
  };
  
  const insertBlock = (blockType: string) => {
    // In a real app, this would insert a block of the specified type
    console.log('Insert block:', blockType);
    setShowBlockMenu(false);
  };
  
  const formatMenuItems = [
    { icon: Bold, label: "Bold", action: () => formatText("bold") },
    { icon: Italic, label: "Italic", action: () => formatText("italic") },
    { icon: Underline, label: "Underline", action: () => formatText("underline") },
    null, // Separator
    { icon: List, label: "Bullet List", action: () => formatText("bullet") },
    { icon: ListOrdered, label: "Numbered List", action: () => formatText("numbered") },
    null,
    { icon: Link, label: "Link", action: () => formatText("link") },
    { icon: Image, label: "Image", action: () => formatText("image") },
    null,
    { icon: AlignLeft, label: "Align Left", action: () => formatText("align-left") },
    { icon: AlignCenter, label: "Align Center", action: () => formatText("align-center") },
    { icon: AlignRight, label: "Align Right", action: () => formatText("align-right") },
  ];
  
  const blockMenuItems = [
    { icon: Heading1, label: "Heading 1", action: () => insertBlock("h1") },
    { icon: Heading2, label: "Heading 2", action: () => insertBlock("h2") },
    { icon: Heading3, label: "Heading 3", action: () => insertBlock("h3") },
    { icon: FileText, label: "Text", action: () => insertBlock("text") },
    { icon: List, label: "Bullet List", action: () => insertBlock("bullet") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertBlock("numbered") },
    { icon: Table, label: "Table", action: () => insertBlock("table") },
    { icon: Code, label: "Code", action: () => insertBlock("code") },
    { icon: Image, label: "Image", action: () => insertBlock("image") },
  ];
  
  return (
    <div className="rich-text-editor w-full">
      <div className="border-b p-2 flex items-center gap-2 overflow-x-auto">
        <Popover open={showBlockMenu} onOpenChange={setShowBlockMenu}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="start">
            <div className="space-y-1">
              {blockMenuItems.map((item, i) => (
                <Button 
                  key={i}
                  variant="ghost" 
                  className="w-full justify-start gap-2 h-9"
                  onClick={item.action}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Separator orientation="vertical" className="h-6" />
        
        {formatMenuItems.map((item, i) => {
          if (item === null) {
            return <Separator key={i} orientation="vertical" className="h-6" />;
          }
          
          return (
            <Button 
              key={i}
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={item.action}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
      
      <div className="p-4">
        <textarea 
          value={content}
          onChange={handleContentChange}
          placeholder="Add notes here..."
          className={cn(
            "w-full min-h-[200px] resize-none focus:outline-none",
            "placeholder:text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
};
