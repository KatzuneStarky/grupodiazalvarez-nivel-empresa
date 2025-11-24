"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRedirectUserByCompanyArea } from "@/hooks/use-redirect-user-to-area";
import { registrationTypes } from "@/modules/auth/constants/registration-types";
import { UserSchema, UserSchemaType } from "@/modules/auth/schema/user.schema";
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePickerForm } from "@/components/custom/date-picker-form";
import UploadImage from "@/components/custom/upload-image-firebase";
import { estadoUsuario } from "@/modules/auth/enum/estado-usuario";
import { LoadingState } from "@/components/skeleton/loading-state";
import { LogoutButton } from "@/components/global/logout-button";
import useUserRegisterBy from "@/hooks/use-user-register-by";
import { writeUser } from "@/modules/auth/actions/write";
import { Controller, useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Shield } from "lucide-react";
import { useTime } from "@/context/time-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { RolUsuario } from "@/enum/user-roles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const UsuarioPage = () => {
    const auth = useAuth();
    const { formattedTime } = useTime()
    const {
        isRegisterByEmail,
        isRegisterByGoogle,
        registerProvider
    } = useUserRegisterBy()

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [defaultEmail, setDefaultEmail] = useState<string | null>("")
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [useCamera, setUseCamera] = useState(false)
    const params = useSearchParams()
    const router = useRouter()

    const invitacionId = params.get("invitacionId")

    const form = useForm<UserSchemaType>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            nombre: auth?.currentUser?.displayName || "",
            uid: auth?.currentUser?.uid || "",
            tipoRegistro: registerProvider === "google.com" ? isRegisterByGoogle : isRegisterByEmail,
            email: defaultEmail || "",
            estado: estadoUsuario.activo,
            fechaNacimiento: new Date(),
            avatarUrl: imageUrl || auth?.currentUser?.photoURL || "",
            rol: RolUsuario.usuario
        }
    });

    useRedirectUserByCompanyArea();

    const onSubmit = async (data: UserSchemaType) => {
        try {
            if (!auth?.currentUser?.uid) {
                toast.error("No se encontró el UID del usuario.");
                return;
            }

            setIsLoading(true);

            toast.promise(
                writeUser(auth?.currentUser?.uid || "", {
                    email: defaultEmail || "",
                    estado: estadoUsuario.activo,
                    tipoRegistro: registerProvider === "google.com" ? isRegisterByGoogle : isRegisterByEmail,
                    uid: auth?.currentUser?.uid || "",
                    empleadoId: "",
                    empresaId: "",
                    nombre: data.nombre || "",
                    rol: data.rol || RolUsuario.usuario,
                    contacto: {}
                }, defaultEmail || "", invitacionId || ""), {
                loading: "Registrando usuario...",
                success: async (result) => {
                    if (result.success) {
                        const response = await fetch("/api/auth/setCustomClaims", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                uid: auth?.currentUser?.uid,
                                rol: result.rol,
                            }),
                        });

                        if (!response.ok) {
                            throw new Error("No se pudieron establecer los custom claims.");
                        }

                        router.push("/");
                        return "Usuario registrado correctamente.";
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el usuario.";
                },
            })
        } catch (error) {
            toast.error("error", {
                description: "No se pudo crear el usuario"
            })
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.currentUser?.email) {
            setDefaultEmail(auth?.currentUser?.email)
            form.setValue("email", auth?.currentUser?.email)
        }
    }, [auth?.currentUser?.email])

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    if (!auth.currentUser) return <LoadingState message='Verificando usuario' />

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="absolute flex gap-2 top-2 right-2">
                <AnimatedToggleMode />
                {auth?.currentUser ? <LogoutButton /> : null}
            </div>

            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Registro de usuario</CardTitle>
                    <CardDescription>
                        Complete su información para registrarse en el sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 gap-4 p-4 bg-muted/50 rounded-lg border">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Firebase UID</Label>
                                    <Input value={auth?.currentUser?.uid} disabled className="bg-muted font-mono text-sm" />
                                    <p className="text-xs text-muted-foreground">
                                        Este ID esta generado automaticamente por firebase
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Informacion personal</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                <FormLabel className="text-sm font-medium">
                                                    Correo electronico
                                                    <span className="text-destructive ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="usuario@correo.com"
                                                        className="h-10"
                                                        disabled
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Correo electronico que se usara para el inicio de sesion.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nombre"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre..." className="h-10" {...field} />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Nombre completo del usuario.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="w-full max-w-md space-y-6 mx-auto">
                                        <div className="p-6 rounded-lg shadow-md">
                                            {/**
                                             * <div className="mb-4 flex flex-wrap gap-2 items-center justify-center">
                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={showFileInfo}
                                                        onChange={(e) => setShowFileInfo(e.target.checked)}
                                                        className="rounded border-gray-300 cursor-pointer" />
                                                    <span>Mostrar detalles de la imagen</span>
                                                </label>

                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={useCamera}
                                                        onChange={(e) => setUseCamera(e.target.checked)}
                                                        className="rounded border-gray-300 cursor-pointer" />
                                                    <span>Usar cámara (móvil)</span>
                                                </label>
                                            </div>
                                             */}

                                            <UploadImage
                                                path={auth?.currentUser?.uid ? `empleados/${auth.currentUser.uid}` : "empleados"}
                                                id={auth?.currentUser?.uid || ""}
                                                image={imageUrl}
                                                onImageUpload={handleImageUpload}
                                                uploadText="Subir imagen"
                                                uploadSubtext="JPG, PNG or WebP (max 5MB)"
                                                maxFileSize={5 * 1024 * 1024}
                                                showFileName={true}
                                                showFileInfo={showFileInfo}
                                                useCamera={useCamera}
                                                showFileTypeIcon={true}
                                            />
                                        </div>

                                        {imageUrl && (
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-medium dark:text-gray-800">Url de la imagen en base de datos:</p>
                                                <p className="text-xs text-gray-700 break-all mt-1">{imageUrl}</p>
                                            </div>
                                        )}
                                    </div>

                                    <DatePickerForm<UserSchemaType>
                                        label="Fecha de nacimiento"
                                        name="fechaNacimiento"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="pt-4 pb-2">
                                    <Separator />
                                </div>

                                <Controller
                                    control={form.control}
                                    name="tipoRegistro"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            {registrationTypes.map((type) => {
                                                const Icon = type.icon
                                                const isSelected =
                                                    registerProvider === "google.com"
                                                        ? type.id === isRegisterByGoogle
                                                        : type.id === isRegisterByEmail
                                                return (
                                                    <div key={type.id} className="relative">
                                                        <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                                                        <div
                                                            onClick={() => field.onChange(type.id)}
                                                            className={cn(
                                                                "flex flex-col rounded-xl border-2 p-6 cursor-pointer transition-all duration-300",
                                                                "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                                                                isSelected
                                                                    ? "border-primary bg-primary/5 shadow-md"
                                                                    : "border-muted bg-card hover:bg-accent/50"
                                                            )}
                                                        >
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div
                                                                    className={cn(
                                                                        "p-3 rounded-full transition-colors",
                                                                        type.bgColor,
                                                                        type.borderColor,
                                                                        "border"
                                                                    )}
                                                                >
                                                                    <Icon className={cn("h-6 w-6", type.iconColor)} />
                                                                </div>

                                                                {isSelected && (
                                                                    <div className="absolute top-3 right-3 p-1 rounded-full bg-primary">
                                                                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="space-y-3 flex-1">
                                                                <div className="space-y-1">
                                                                    <h3 className="font-semibold text-base leading-tight">
                                                                        {type.title}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground">{type.subtitle}</p>
                                                                </div>

                                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                                    {type.description}
                                                                </p>

                                                                <div className="space-y-1">
                                                                    {type.features.map((feature, index) => (
                                                                        <div key={index} className="flex items-center gap-2">
                                                                            <Shield className="h-3 w-3 text-green-600" />
                                                                            <span className="text-xs text-muted-foreground">{feature}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={cn(
                                                                    "mt-4 h-1 rounded-full transition-colors",
                                                                    isSelected ? "bg-primary" : "bg-muted"
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </RadioGroup>
                                    )}
                                />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Informacion en sistema</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Creado el
                                            </Label>
                                            <p className="text-sm font-mono bg-background px-2 py-1 rounded border">
                                                {new Date().toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Hora actual: {formattedTime}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Ultima actualizacion
                                            </Label>
                                            <p className="text-sm font-mono bg-background px-2 py-1 rounded border">
                                                Agregado al registrar
                                            </p>
                                            <p className="text-xs text-muted-foreground">Auto actualizable</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Estado del registro
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <p className="text-sm">Nuevo registro</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Listo para crear</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 pt-6 border-t">
                                    <Button
                                        type="submit"
                                        className="h-12 text-base font-medium"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Registrando usuario...
                                            </div>
                                        ) : (
                                            "Registrar usuario"

                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        Al registrarse como usuario aceptas que los datos sean correctos
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UsuarioPage;
