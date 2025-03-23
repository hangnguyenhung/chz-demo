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

const editAccountSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().nonempty("Username is required"),
    display_name: z.string().nonempty("Display name is required"),
    phone_number: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[0-9]{10,15}$/.test(val),
            "Phone number must be between 10 and 14 digits"
        ),
});

export function EditAccountDialog({
    title,
    onSave,
    onCancel,
    open,
    onOpenChange,
    account,
    isLoading,
}) {
    const {register, handleSubmit, formState, reset} = useForm({
        resolver: zodResolver(editAccountSchema),
        defaultValues: {
            email: account?.email || "",
            username: account?.username || "",
            display_name: account?.display_name || "",
            phone_number: account?.phone_number || "",
        },
    });

    const onSubmit = async (data) => {
        onSave(data);
    };

    useEffect(() => {
        reset({
            email: account?.email || "",
            username: account?.username || "",
            display_name: account?.display_name || "",
            phone_number: account?.phone_number || "",
        });
    }, [account, reset]);

    const {errors} = formState;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} id="edit-account-dialog">
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Update account information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email Field (Disabled) */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" disabled {...register("email")} />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    {/* Username Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" disabled {...register("username")} />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username.message}</p>
                        )}
                    </div>
                    {/* Display Name Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            id="display_name"
                            type="text"
                            placeholder="Display Name"
                            {...register("display_name")}
                        />
                        {errors.display_name && (
                            <p className="text-sm text-red-500">{errors.display_name.message}</p>
                        )}
                    </div>
                    {/* Phone Number Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                            id="phone_number"
                            type="text"
                            placeholder="Phone Number"
                            {...register("phone_number")}
                        />
                        {errors.phone_number && (
                            <p className="text-sm text-red-500">{errors.phone_number.message}</p>
                        )}
                    </div>
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
                        <Button disabled={isLoading}>
                            {isLoading && <Loader2 className="animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
