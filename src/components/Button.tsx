import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../services/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",
                ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
                link: "text-primary underline-offset-4 hover:underline",
                gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow hover:opacity-90 active:scale-95",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-11 rounded-md px-8 text-base",
                xl: "h-12 rounded-md px-10 text-lg",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, loading = false, disabled, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {children}
                    </span>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };