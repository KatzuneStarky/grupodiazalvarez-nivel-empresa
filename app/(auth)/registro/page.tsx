"use client"

import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode"
import { SocialLoginButtons } from "@/components/global/social-login-buttons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Eye, EyeOff, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import Image from "next/image"
import { z } from "zod"
import { Form } from "@/components/ui/form"

interface PasswordRequirement {
    id: string
    label: string
    validator: (password: string) => boolean
}

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, "Debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
        .regex(/[a-z]/, "Debe tener al menos una minúscula")
        .regex(/[0-9]/, "Debe tener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
    const auth = useAuth();

    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
    })

    const passwordRequirements: PasswordRequirement[] = [
        {
            id: "uppercase",
            label: "Debe de contener un mayúscula",
            validator: (password) => /[A-Z]/.test(password),
        },
        {
            id: "lowercase",
            label: "Debe de contener una minúscula",
            validator: (password) => /[a-z]/.test(password),
        },
        {
            id: "number",
            label: "Debe de contener un número",
            validator: (password) => /[0-9]/.test(password),
        },
        {
            id: "special",
            label: "Debe de contener un carácter especial",
            validator: (password) => /[^A-Za-z0-9]/.test(password),
        },
        {
            id: "length",
            label: "Debe de contener un mínimo de 8 caracteres",
            validator: (password) => password.length >= 8,
        },
    ]

    const passwordValue = form.watch("password") ?? "";

    useEffect(() => {
        const subscription = form.watch((value) => {
            setPasswordMatch(value.password === value.confirmPassword);
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const onSubmit = async(data: RegisterSchemaType) => {
        await auth?.registerWithEmail(data.email, data.password)
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="absolute top-2 left-2">
                <AnimatedToggleMode />
            </div>


            <div className="flex flex-1 md:w-1/2 items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8 transition-all duration-300 ease-in-out">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Crea una cuenta</h2>
                        <p className="mt-2 text-sm text-gray-500">Registrate para comenzar a usar la plataforma</p>
                    </div>

                    <Form {...form}>
                        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">

                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tuemail@ejemplo.com"
                                        {...form.register("email")}
                                        aria-invalid={!!form.formState.errors.email}
                                        aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                                        className="transition-all duration-200"
                                        disabled={auth?.isLoading}
                                    />
                                    {form.formState.errors.email && (
                                        <p id="register-email-error" className="text-sm text-red-500">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Tu contraseña"
                                            {...form.register("password")}
                                            aria-invalid={!!form.formState.errors.password}
                                            aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                                            className="transition-all duration-200"
                                            disabled={auth?.isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        {passwordRequirements.map((requirement) => {
                                            const isMet = requirement.validator(passwordValue)
                                            return (
                                                <div key={requirement.id} className="flex items-center text-sm">
                                                    {isMet ? (
                                                        <Check className="h-4 w-4 mr-2 text-green-500" />
                                                    ) : (
                                                        <X className="h-4 w-4 mr-2 text-gray-300 dark:text-white" />
                                                    )}
                                                    <span className={cn(isMet ? "text-green-600" : "text-gray-500 dark:text-white")}>{requirement.label}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="confirma tu contraseña"
                                            {...form.register("confirmPassword")}
                                            aria-invalid={!!form.formState.errors.password}
                                            aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                                            className={cn(
                                                "pr-10 transition-all duration-200",
                                                form.watch("confirmPassword") && !passwordMatch ? "border-red-500" : "",
                                            )}
                                            disabled={auth?.isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {form.watch("confirmPassword") && !passwordMatch && (
                                        <p id="password-match-error" className="text-sm text-red-500">
                                            Las contraseñas no coinciden
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 
                            transition-colors cursor-pointer dark:text-white"
                                disabled={auth?.isLoading}
                            >
                                {auth?.isLoading ? "Creando cuenta..." : "Crear cuenta"}
                            </Button>

                            <SocialLoginButtons isLoading={auth?.isLoading || false} />

                            <div className="text-center text-sm">
                                <span className="text-gray-500 dark:text-white">¿Ya tienes una cuenta?</span>{" "}
                                <button
                                    type="button"
                                    onClick={() => window.location.href = "/entrar"}
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            <div className="h-[30vh] md:h-auto md:w-1/2 relative bg-blue-50">
                <Image src="/background.jpg" alt="Decorative" fill className="object-cover" priority />
            </div>
        </div>
    )
}

export default RegisterPage