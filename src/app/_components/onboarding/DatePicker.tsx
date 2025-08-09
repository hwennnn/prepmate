import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
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
  const [month, setMonth] = useState<Date>(value ?? new Date());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(e.target.value);
    const newMonth = new Date(month.getFullYear(), monthIndex, 1);
    setMonth(newMonth);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    const newMonth = new Date(year, month.getMonth(), 1);
    setMonth(newMonth);
  };

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
        <div className="flex gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="relative">
            <select
              value={month.getMonth()}
              onChange={handleMonthChange}
              className="w-[120px] appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
            >
              {months.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
          <div className="relative">
            <select
              value={month.getFullYear()}
              onChange={handleYearChange}
              className="w-[80px] appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          month={month}
          onMonthChange={setMonth}
          initialFocus
          className="bg-white dark:bg-slate-950"
        />
      </PopoverContent>
    </Popover>
  );
}
