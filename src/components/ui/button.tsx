import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
 "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
 {
  variants: {
   variant: {
    default: "bg-mainlilly text-primary-foreground hover:bg-mainlilly/75 font-bold",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    tertiary: "bg-black text-primary-foreground hover:bg-gray-800",
    secondary: "bg-main-darkblue text-white hover:bg-blue-950/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    semighost: "bg:white border text-main-darkblue hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    genericModalNo: "bg-slate text-destructive-foreground hover:bg-slate-500",
    outlineMainlilly: "bg-white border border-mainlilly text-mainlilly hover:bg-mainlilly/10 font-bold",
   },
   size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-lg px-8 py-4 md:py-6 text-sm md:text-base",
    icon: "h-10 w-10",
   },
  },
  defaultVariants: {
   variant: "default",
   size: "default",
  },
 }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
 asChild?: boolean;
 isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, isLoading, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
   <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
    {isLoading && <span className="animate-spin rounded-full border-2 border-t-transparent border-white h-4 w-4 mr-2" />}
    {children}
   </Comp>
  );
 }
);
Button.displayName = "Button";

export { Button, buttonVariants };
