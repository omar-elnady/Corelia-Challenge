import { useForm, FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/auth-layout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/input-field";
import { Loader2 } from "lucide-react";
import logo from "@/assets/Corelia_RICOH_logo.svg";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { register } from '@/redux/authSlice';
import { toast } from 'sonner';

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
}

export default function RegisterPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { users } = useSelector((state: RootState) => state.auth);

    const methods = useForm<RegisterFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const { reset, formState: { isSubmitting } } = methods;

    const onSubmit = async (data: RegisterFormValues) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userExists = users.some(u => u.email === data.email);

        if (userExists) {
            toast.error("Email is already registered");
            return;
        }

        dispatch(register({
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            password: data.password
        }));

        toast.success("Registration successful! Redirecting...");
        reset();
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
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3">
                            <InputField
                                placeholder="Full Name"
                                {...methods.register("name", {
                                    required: "Full Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Name must be at least 3 characters",
                                    },
                                    validate: (value) => {
                                        if (/^\d/.test(value)) {
                                            return "Name cannot start with a number";
                                        }
                                        if (!/^[A-Za-z][A-Za-z0-9\- ]*$/.test(value)) {
                                            return "Name can only contain letters, numbers, spaces, and hyphens";
                                        }
                                        return true;
                                    }
                                })}
                            />
                            <InputField
                                type="email"
                                placeholder="Email Address"
                                {...methods.register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.org|com|net|edu|gov|mil$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            <InputField
                                type="password"
                                placeholder="Password"
                                {...methods.register("password", {
                                    required: "Password is required",
                                    validate: (value) => {
                                        const errors = [];

                                        if (value.length < 8) {
                                            errors.push("at least 8 characters");
                                        }
                                        if (!/[A-Z]/.test(value)) {
                                            errors.push("one uppercase letter");
                                        }
                                        if (!/[a-z]/.test(value)) {
                                            errors.push("one lowercase letter");
                                        }
                                        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                                            errors.push("one special character");
                                        }

                                        if (errors.length > 0) {
                                            return `Password must contain: ${errors.join(', ')}`;
                                        }

                                        return true;
                                    }
                                })}
                            />
                            <div className="flex justify-center">
                                <Button className="w-3/4 py-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg" type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isSubmitting ? "Creating account..." : "Register"}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
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
