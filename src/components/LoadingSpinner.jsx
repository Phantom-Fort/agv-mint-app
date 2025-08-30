import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const LoadingSpinner = React.forwardRef(
  ({ size = "md", text = "", asChild = false, className = "", ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    return (
      <Comp
        ref={ref}
        role="status"
        aria-label={text || "Loading..."}
        className={`flex items-center justify-center space-x-2 ${className}`}
        {...props}
      >
        <div
          className={`${sizeClasses[size]} border-2 border-blue-600 border-t-transparent rounded-full animate-spin`}
        />
        {text && (
          <span className="text-sm text-gray-600" aria-hidden="true">
            {text}
          </span>
        )}
      </Comp>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
