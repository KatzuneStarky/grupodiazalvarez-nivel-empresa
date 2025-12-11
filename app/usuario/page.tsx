"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, User, Mail, Fingerprint, Loader2 } from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { writeUser } from "@/modules/auth/actions/write";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Controller, useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTime } from "@/context/time-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { RolUsuario } from "@/enum/user-roles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
        <div className="h-screen w-full flex items-center justify-center p-4 bg-muted/20">
            <Card className="w-full max-w-[1600px] h-[90vh] lg:h-[85vh] flex flex-col overflow-hidden shadow-xl border-t-4 border-t-primary">
                <CardHeader className="border-b bg-card py-4 px-6 shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-xl">Registro de usuario</CardTitle>
                        <CardDescription>
                            Complete su información para registrarse en el sistema.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <AnimatedToggleMode />
                        {auth?.currentUser ? <LogoutButton /> : null}
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col lg:grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x">
                            {/* Left Column: Personal Info (Sidebar style) */}
                            <div className="lg:col-span-4 h-full bg-muted/10">
                                <ScrollArea className="h-full">
                                    <div className="p-6 space-y-6">
                                        {/* Image Upload Section */}
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="relative group">
                                                <UploadImage
                                                    path={auth?.currentUser?.uid ? `empleados/${auth.currentUser.uid}` : "empleados"}
                                                    id={auth?.currentUser?.uid || ""}
                                                    image={imageUrl}
                                                    onImageUpload={handleImageUpload}
                                                    uploadText="Foto de perfil"
                                                    uploadSubtext=""
                                                    maxFileSize={5 * 1024 * 1024}
                                                    showFileName={false}
                                                    showFileInfo={false}
                                                    useCamera={useCamera}
                                                    showFileTypeIcon={false}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Foto de Perfil</p>
                                                <p className="text-xs text-muted-foreground">Requerida para identificación</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Basic Fields */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                    <Fingerprint className="w-3 h-3" /> UID (Firebase)
                                                </Label>
                                                <div className="bg-muted p-2.5 rounded-md text-xs font-mono truncate" title={auth?.currentUser?.uid}>
                                                    {auth?.currentUser?.uid}
                                                </div>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> Correo electrónico
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled className="bg-muted text-sm h-9" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="nombre"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1">
                                                            <User className="w-3 h-3" /> Nombre Completo
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Tu nombre..." {...field} className="h-9" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <DatePickerForm<UserSchemaType>
                                                label="Fecha de nacimiento"
                                                name="fechaNacimiento"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Right Column: Registration Type & System Info */}
                            <div className="lg:col-span-8 h-full flex flex-col bg-background">
                                <ScrollArea className="flex-1">
                                    <div className="p-6 lg:p-8 space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="tipoRegistro"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                            <Shield className="w-5 h-5 text-primary" />
                                                            Tipo de Registro
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">Selecciona el perfil que mejor describa tu rol en la organización.</p>
                                                    </div>

                                                    <FormControl>
                                                        <RadioGroup
                                                            className="grid grid-cols-1 xl:grid-cols-2 gap-4"
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
                                                                                "flex flex-col h-full rounded-xl border-2 p-5 cursor-pointer transition-all duration-300",
                                                                                "hover:shadow-md hover:border-primary/50 relative overflow-hidden",
                                                                                isSelected
                                                                                    ? "border-primary bg-primary/5 shadow-md"
                                                                                    : "border-muted bg-card hover:bg-accent/50"
                                                                            )}
                                                                        >
                                                                            {isSelected && (
                                                                                <div className="absolute top-0 right-0 p-2 bg-primary rounded-bl-xl z-10">
                                                                                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-start gap-4 mb-3">
                                                                                <div
                                                                                    className={cn(
                                                                                        "p-2.5 rounded-lg shrink-0",
                                                                                        type.bgColor,
                                                                                        type.borderColor,
                                                                                        "border"
                                                                                    )}
                                                                                >
                                                                                    <Icon className={cn("h-6 w-6", type.iconColor)} />
                                                                                </div>
                                                                                <div>
                                                                                    <h3 className="font-semibold text-base leading-tight">
                                                                                        {type.title}
                                                                                    </h3>
                                                                                    <p className="text-xs text-muted-foreground mt-1">{type.subtitle}</p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-2 mt-auto">
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {type.description}
                                                                                </p>
                                                                                <div className="space-y-1 pt-2 border-t border-dashed">
                                                                                    {type.features.map((feature, index) => (
                                                                                        <div key={index} className="flex items-center gap-2">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{feature}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        {/* System Info Block */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-muted/30 rounded-lg border text-center md:text-left">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase">Fecha Registro</span>
                                                <p className="font-mono text-sm mt-1">{new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="p-4 bg-muted/30 rounded-lg border text-center md:text-left">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase">Estado</span>
                                                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <p className="font-mono text-sm">Nuevo</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-muted/30 rounded-lg border text-center md:text-left">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase">Auto-Sync</span>
                                                <p className="font-mono text-sm mt-1 text-green-600">Active</p>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                {/* Footer / Submit Section */}
                                <div className="p-6 border-t bg-muted/5 mt-auto shrink-0">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <p className="text-xs text-muted-foreground text-center md:text-left">
                                            Al registrarse, acepta los términos y condiciones de la plataforma.
                                            <br />Sus datos serán procesados de acuerdo a nuestra política de privacidad.
                                        </p>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full md:w-auto min-w-[200px]"
                                            disabled={form.formState.isSubmitting}
                                        >
                                            {form.formState.isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Registrando...
                                                </>
                                            ) : (
                                                "Confirmar Registro"
                                            )}
                                        </Button>
                                    </div>
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
