
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface DatePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  lockDates?: boolean;
  onLockDatesChange?: (locked: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  lockDates = false,
  onLockDatesChange,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate && endDate ? (
            <span>
              {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
            </span>
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Start date</h3>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={onStartDateChange}
                className="p-0 rounded-md border shadow-sm pointer-events-auto"
              />
              <div className="text-sm text-center mt-1">
                {startDate ? format(startDate, "MMMM d, yyyy") : "Not set"}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Due date</h3>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={onEndDateChange}
                className="p-0 rounded-md border shadow-sm pointer-events-auto"
              />
              <div className="text-sm text-center mt-1">
                {endDate ? format(endDate, "MMMM d, yyyy") : "Not set"}
              </div>
            </div>
          </div>
          
          {onLockDatesChange && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lock-dates" 
                checked={lockDates}
                onCheckedChange={(checked) => 
                  onLockDatesChange(checked as boolean)
                }
              />
              <label 
                htmlFor="lock-dates" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lock dates
              </label>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                onStartDateChange(undefined);
                onEndDateChange(undefined);
              }}
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
