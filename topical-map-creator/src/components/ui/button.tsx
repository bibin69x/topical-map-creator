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
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 rounded-md text-sm",
          {
            "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm": variant === "default",
            "border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white": variant === "outline",
            "bg-slate-800 text-slate-200 hover:bg-slate-700": variant === "secondary",
            "hover:bg-slate-800 text-slate-300 hover:text-white": variant === "ghost",
            "bg-rose-600 text-white hover:bg-rose-500": variant === "destructive",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
