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
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect} from "react";
import {Loader2} from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

// 📌 Schema validation với Zod
const createAccountSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().nonempty("Username is required"),
    display_name: z.string().nonempty("Display name is required"),
    phone_number: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[0-9]{10,15}$/.test(val),
            "Phone number must be between 10 and 15 digits"
        ),
    password: z.string(),
    account_type: z.enum(["admin", "vendor", "customer"], {
        required_error: "Account type is required",
    }),
});

export function CreateAccountDialog({title, onSave, onCancel, open, onOpenChange, isLoading}) {
    const {register, handleSubmit, formState, reset, control} = useForm({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            email: "",
            username: "",
            display_name: "",
            phone_number: "",
            password: "",
            account_type: "Vendor",
        },
    });

    const onSubmit = async (data) => {
        onSave(data);
    };

    useEffect(() => {
        if (open) {
            reset({
                email: "",
                username: "",
                display_name: "",
                phone_number: "",
                password: "",
                account_type: "Vendor",
            });
        }
    }, [open, reset]);

    const {errors} = formState;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} id="create-account-dialog">
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Enter account details to create a new user.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Email" {...register("email")} />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Username Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            {...register("username")}
                        />
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

                    {/* Password Field */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Account Type Field (Select) */}
                    <div className="grid w-full gap-2">
                        <Label htmlFor="account_type">Account Type</Label>
                        <Controller
                            name="account_type"
                            control={control}
                            render={({field}) => (
                                <Select
                                    id="account_type"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.account_type && (
                            <p className="text-sm text-red-500">{errors.account_type.message}</p>
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
                            Create Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
