import React, {forwardRef, useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "./ui/button";

const PasswordInput = forwardRef((props, ref) => {
    const {className, disabled, ...rest} = props;
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className={cn("relative rounded-md", className)}>
            <input
                type={showPassword ? "text" : "password"}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                ref={ref}
                disabled={disabled}
                {...rest}
            />
            <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled}
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </Button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export {PasswordInput};
