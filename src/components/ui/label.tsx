import * as React from "react";
import { cn } from "~/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-100",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Label };
