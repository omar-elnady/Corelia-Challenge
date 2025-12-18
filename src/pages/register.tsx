import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/auth-layout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/input-field";
import { Loader2 } from "lucide-react";
import logo from "@/assets/Corelia_RICOH_logo.svg";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { register } from '@/redux/authSlice';

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
}

export default function RegisterPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const methods = useForm<RegisterFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch(register({
            name: data.name,
            email: data.email
        }));

        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };

    return (
        <AuthLayout>
            <Card className="w-full bg-white">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center ">
                        <img
                            src={logo}
                            alt="Corelia Ricoh Logo"
                            className="h-28 w-auto "
                        />
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {success ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                <svg
                                    className="h-6 w-6 text-green-600 dark:text-green-400"
                                    fill="none"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium">Registration Successful!</h3>
                            <p className="text-center text-muted-foreground">
                                Redirecting you to login...
                            </p>
                        </div>
                    ) : (
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                                <InputField
                                    placeholder="Full Name"
                                    {...methods.register("name", {
                                        required: "Full Name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Name must be at least 3 characters",
                                        },
                                    })}
                                />
                                <InputField
                                    type="email"
                                    placeholder="Email Address"
                                    {...methods.register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                                <InputField
                                    type="password"
                                    placeholder="Password"
                                    {...methods.register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                    })}
                                />
                                <div className="flex justify-center">
                                    <Button className="w-3/4 py-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg" type="submit" disabled={isLoading}>
                                        {isLoading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {isLoading ? "Creating account..." : "Register"}
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center text-sm text-indigo-700">
                        I already have an account{" "}
                        <Link to="/login" className="underline underline-offset-4 hover:text-indigo-800 font-medium">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
