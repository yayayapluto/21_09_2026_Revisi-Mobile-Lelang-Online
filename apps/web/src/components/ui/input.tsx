import * as React from "react";

import {cn} from "@/lib/utils";

function Input({className, type, ...props}: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-sm placeholder:text-muted-foreground selection:bg-primary/20 selection:text-primary-foreground dark:bg-input/30 border-black/40 flex h-12 w-full min-w-0 rounded-md border bg-transparent px-2",
                "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className,
            )}
            {...props}
        />
    );
}

export {Input};
