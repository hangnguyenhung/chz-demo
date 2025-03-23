"use client";

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect} from "react";
import {Loader2} from "lucide-react";

// Schema chỉ cần xác thực username
const resetPasswordSchema = z.object({
    username: z.string().nonempty("Username is required"),
});

export function ResetPasswordDialog({title, onSave, onCancel, open, onOpenChange, isLoading}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {username: ""},
    });

    const onSubmit = async (data) => {
        onSave(data);
    };

    useEffect(() => {
        if (open) {
            reset({username: ""});
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} id="reset-password-dialog">
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <div>Enter username to reset password.</div>
                        <span>
                            Password default is: <strong>A123bcd</strong>
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Username Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" {...register("username")} />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username.message}</p>
                        )}
                    </div>
                    {/* Dialog Footer */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="animate-spin" />}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
