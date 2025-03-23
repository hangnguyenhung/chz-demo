"use client";

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export function TooltipWrap({children, desc}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>
                    <p>{desc}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
