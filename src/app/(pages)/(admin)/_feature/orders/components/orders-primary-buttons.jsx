"use client";

import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useOrdersContext} from "../context/orders-context";

export function OrdersPrimaryButtons() {
    const {setOpen, setIsInvite} = useOrdersContext();

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="default"
                size="sm"
                className="h-8 gap-1"
                onClick={() => {
                    setIsInvite(true);
                    setOpen(true);
                }}
            >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Order</span>
            </Button>
        </div>
    );
}
