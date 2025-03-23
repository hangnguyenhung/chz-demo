"use client";

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Loader2} from "lucide-react";

export function BaseDialog({
    title,
    children,
    onSave,
    onCancel,
    saveText = "Save changes",
    cancelText = "Cancel",
    open,
    onOpenChange,
    isLoading,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} id="active-dialog">
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div>{children}</div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                    </DialogClose>

                    <Button type="button" onClick={onSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="animate-spin" />}

                        {saveText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
