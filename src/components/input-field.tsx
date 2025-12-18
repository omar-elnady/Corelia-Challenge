import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
}

export function InputField({
    className,
    type = "text",
    name,
    ...props
}: InputFieldProps) {
    const {
        formState: { errors },
    } = useFormContext();

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const errorMessage = errors[name]?.message as string | undefined;

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    id={name}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    className={cn(errorMessage && "border-red-200", className)}
                    name={name}
                    {...props}
                />
                {isPassword && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 cursor-pointer text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 cursor-pointer text-muted-foreground" />
                        )}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </Button>
                )}
            </div>
            {errorMessage && (
                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            )}
        </div>
    );
}
