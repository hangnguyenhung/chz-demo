"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useForm, Controller} from "react-hook-form";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "sonner";

// --------------------------------------------------
// 1. Định nghĩa Schema
// --------------------------------------------------
const registerSchema = z
    .object({
        email: z.string().email("Invalid email address").nonempty("Email is required"),
        username: z.string().nonempty("Username is required"),
        display_name: z.string().nonempty("Display name is required"),
        phone_number: z.string().regex(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits"),
        account_type: z.enum(["admin", "vendor", "customer"], {
            required_error: "Account type is required",
        }),
        password: z.string().nonempty("Password is required"),
        confirmPassword: z.string().nonempty("Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// --------------------------------------------------
// 2. Form Component
// --------------------------------------------------
export function RegisterForm({className, ...props}) {
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const onSubmit = (data) => {
        delete data.confirmPassword;
        handleCreateAccount(data);
    };

    const handleCreateAccount = async (data) => {
        await createAccount(data);
    };

    const {
        mutateAsync: createAccount,
        isPending: isCreatePending,
        isSuccess,
    } = useMutation({
        mutationFn: async (params) => {
            const response = await axios.post("/api/authen/register", params);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Account created successfully");
        },
    });

    if (isSuccess) {
        return (
            <Card>
                <CardContent className="mt-6 flex flex-col gap-4">
                    <div className="text-center text-2xl">Account created successfully</div>
                    <Button onClick={() => router.push("/login")}>Login</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4">
                            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid w-full gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" type="text" {...register("username")} />
                                    {errors.username && (
                                        <p className="text-sm text-red-500">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="display_name">Display Name</Label>
                                    <Input
                                        id="display_name"
                                        type="text"
                                        {...register("display_name")}
                                    />
                                    {errors.display_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.display_name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid w-full gap-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        type="text"
                                        {...register("phone_number")}
                                    />
                                    {errors.phone_number && (
                                        <p className="text-sm text-red-500">
                                            {errors.phone_number.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="account_type">Account Type</Label>
                                    <Controller
                                        control={control}
                                        name="account_type"
                                        render={({field}) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select an account type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="vendor">Vendor</SelectItem>
                                                    <SelectItem value="customer">
                                                        Customer
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.account_type && (
                                        <p className="text-sm text-red-500">
                                            {errors.account_type.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...register("password")}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="text-gray-400" size={18} />
                                            ) : (
                                                <Eye className="text-gray-400" size={18} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid w-full gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            {...register("confirmPassword")}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="text-gray-400" size={18} />
                                            ) : (
                                                <Eye className="text-gray-400" size={18} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isCreatePending}>
                                {isCreatePending && <Loader2 className="animate-spin" />}
                                Sign Up
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Button
                                onClick={() => router.push("/login")}
                                variant="link"
                                type="button"
                                className="px-0 underline underline-offset-4"
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
