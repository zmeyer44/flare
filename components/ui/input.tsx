import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

type InputPostProps = InputProps & {
  post: React.ReactNode;
};

const InputPost = React.forwardRef<HTMLInputElement, InputPostProps>(
  ({ className, type, post, ...props }, ref) => {
    return (
      <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <input className="invisible-input" ref={ref} {...props} />
        <span className="flex select-none items-center pl-3 text-muted-foreground">
          {post}
        </span>
      </div>
    );
  },
);
InputPost.displayName = "InputPost";

export { Input, InputPost };
