import { cva, type VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    },
    color: {
      muted: "text-muted-foreground",
      primary: "text-primary",
      white: "text-white",
      green: "text-green-500",
      neon: "text-[#39ff14]",
    },
  },
  defaultVariants: {
    size: "md",
    color: "muted",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  strokeWidth?: number;
  "aria-label"?: string;
}

export const Spinner = ({
  size,
  color,
  className,
  strokeWidth = 2,
  "aria-label": ariaLabel = "Loading...",
}: SpinnerProps) => {
  return (
    <Loader
      aria-label={ariaLabel}
      role="status"
      className={cn(spinnerVariants({ size, color }), className)}
      strokeWidth={strokeWidth}
    />
  );
};
