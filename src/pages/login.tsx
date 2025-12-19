import { useForm, FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/auth-layout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/input-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import logo from "@/assets/Corelia_RICOH_logo.svg";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { login } from '@/redux/authSlice';
import { toast } from 'sonner';



interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const methods = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const { users } = useSelector((state: RootState) => state.auth);

    const { formState: { isSubmitting } } = methods;

    const onSubmit = async (data: LoginFormValues) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userByEmail = users.find(u => u.email === data.email);

        if (!userByEmail) {
            toast.error("User not found");
            return;
        }

        if (userByEmail.password !== data.password) {
            toast.error("Wrong password");
            return;
        }

        dispatch(login({ email: data.email, password: data.password }));
        toast.success(`Welcome back, ${userByEmail.name}!`);
        navigate("/");
    };

    return (
        <AuthLayout>
            <Card className="w-full md:h-fit h-3/4 md:block flex flex-col justify-center  bg-white">
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
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3 " >
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
                            <div className="space-y-2">
                                <InputField
                                    type="password"
                                    placeholder="Password"
                                    {...methods.register("password", {
                                        required: "Password is required",
                                    })}
                                />

                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-center  space-x-2">
                                    <Checkbox className={` ${methods.formState.errors.rememberMe ? "border-destructive" : ""}`} id="rememberMe" {...methods.register("rememberMe")} />
                                    <Label htmlFor="rememberMe" className="text-sm font-normal text-indigo-700">
                                        Remember me
                                    </Label>
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link
                                        to="#"
                                        className="text-sm font-medium text-indigo-700 hover:text-indigo-800 underline underline-offset-4"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button className="w-3/4 py-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg" type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isSubmitting ? "Logging in..." : "Log in"}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
                <CardFooter>
                    <div className="w-full text-indigo-700 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="underline underline-offset-4 hover:text-indigo-800 font-medium">
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
