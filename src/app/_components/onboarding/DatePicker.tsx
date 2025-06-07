import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 w-auto border border-slate-200 bg-white p-0 shadow-lg dark:border-slate-800 dark:bg-slate-950"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
          initialFocus
          className="bg-white dark:bg-slate-950"
        />
      </PopoverContent>
    </Popover>
  );
}
