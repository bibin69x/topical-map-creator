import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 rounded text-xs tracking-wide",
          {
            "bg-slate-100 text-slate-900 hover:bg-white border border-slate-200 shadow-none font-semibold": variant === "default",
            "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 shadow-none": variant === "outline",
            "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700": variant === "secondary",
            "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80": variant === "ghost",
            "bg-rose-950 text-rose-200 border border-rose-800 hover:bg-rose-900": variant === "destructive",
            "h-8 px-3 py-1.5": size === "default",
            "h-7 px-2.5 text-[11px]": size === "sm",
            "h-9 px-5 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

