"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode";
import { SocialLoginButtons } from "@/components/global/social-login-buttons";
import { LogoutButton } from "@/components/global/logout-button";
import { SocialProvider } from "@/types/social-provider";
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import z from "zod"

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

const LoginPage = () => {
    const { currentUser, loginWithGoogle, loginWithEmail, isLoading } = useAuth();
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setTimeout(() => {
            setForgotPasswordOpen(false)
        }, 1000)
    }

    const handleSocialLogin = (provider: SocialProvider) => {
        if (provider === "google") {
            loginWithGoogle()
        }
    }

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        await loginWithEmail(data.email, data.password);
    };

    return (
        <div className="flex min-h-screen flex-col-reverse md:flex-row">
            <div className="absolute flex gap-2 top-2 right-2">
                <AnimatedToggleMode />
                {currentUser ? <LogoutButton /> : null}
            </div>
            <div className="h-[30vh] md:h-auto md:w-1/2 relative bg-blue-50">
                <Image src="/background.jpg" alt="Decorative" fill className="object-cover" priority />
            </div>

            <div className="flex flex-1 md:w-1/2 items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8 transition-all duration-300 ease-in-out">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Bienvenido de vuelta</h2>
                        <p className="mt-2 text-sm text-gray-500">Inicia sesión para continuar</p>
                    </div>

                    <Form {...form}>
                        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tuemail@ejemplo.com"
                                        {...form.register("email")}
                                        aria-invalid={!!form.formState.errors.email}
                                        aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                                        className="transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                    {form.formState.errors.email && (
                                        <p id="email-error" className="text-sm text-red-500">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <button
                                            type="button"
                                            onClick={() => setForgotPasswordOpen(true)}
                                            className="text-sm font-medium text-red-600 
                                            hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Tu contraseña"
                                            {...form.register("password")}
                                            aria-invalid={!!form.formState.errors.password}
                                            aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                                            className="transition-all duration-200"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                                        hover:text-gray-700 transition-colors cursor-pointer"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember-me"
                                        checked={rememberMe}
                                        disabled
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    />
                                    <Label
                                        htmlFor="remember-me"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Recordarme
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 
                            transition-colors cursor-pointer dark:text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </Button>

                            <SocialLoginButtons isLoading={isLoading || false} onSocialLogin={handleSocialLogin} />

                            <div className="text-center text-sm">
                                <span className="text-gray-500">¿No tienes una cuenta?</span>{" "}
                                <button
                                    type="button"
                                    onClick={() => window.location.href = "/registro"}
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                                >
                                    ¿Crear cuenta?
                                </button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>¿Olvidaste tu contraseña?</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input id="reset-email" type="email" placeholder="you@example.com" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Enviando..." : "Enviar enlace de restablecimiento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginPage