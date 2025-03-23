"use client";

import {useEffect, useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {AccountTypeCustomer, AccountTypeMember} from "@/lib/constance";

const loginSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string(),
});

const LoginForm = (props) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const {ref, onChange: onChangeRegister, ...rest} = register("password");

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");
    const router = useRouter();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setLoginError("");
        const result = await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setLoginError(result.error);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const handleChange = () => {
        setLoginError("");
    };

    const session = useSession();

    useEffect(() => {
        if (session?.status === "authenticated") {
            const accountType = session.data.user.account_type.toLowerCase();
            if (accountType === AccountTypeMember || accountType === AccountTypeCustomer) {
                router.push("/customer/home");
            } else {
                router.push("/admin/orders");
            }
        }
    }, [session, router]);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder=""
                                    {...register("username")}
                                    onChange={(e) => handleChange("username", e.target.value)}
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-500">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        ref={ref}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        onChange={(e) => {
                                            onChangeRegister(e);
                                            handleChange("password", e.target.value);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
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
                            {loginError && <div className="text-sm text-red-500">{loginError}</div>}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin" />}
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Button
                                onClick={() => router.push("/register")}
                                variant="link"
                                type="button"
                                className="px-0 underline underline-offset-4"
                            >
                                Sign up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;
