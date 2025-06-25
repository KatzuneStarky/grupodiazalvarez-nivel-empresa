"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tipoRegistroUsuario } from "@/modules/auth/enum/tipo-registro-usuario";
import { UserSchema, UserSchemaType } from "@/modules/auth/schema/user.schema";
import { DatePickerForm } from "@/components/custom/date-picker-form";
import { estadoUsuario } from "@/modules/auth/enum/estado-usuario";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const UsuarioPage = () => {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [defaultEmail, setDefaultEmail] = useState<string | null>("")

    const form = useForm<UserSchemaType>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            nombre: auth?.currentUser?.displayName || "",
            uidFirebase: auth?.currentUser?.uid || "",
            tipoRegistro: tipoRegistroUsuario.google,
            email: defaultEmail || "",
            estado: estadoUsuario.activo,
            fechaNacimiento: new Date(),
            avatarUrl: auth?.currentUser?.photoURL || "",
        }
    });

    const onSubmit = async (data: UserSchemaType) => {
        try {
            setIsLoading(true);
        } catch (error) { }
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

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="max-w-2xl mx-auto">
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
                                    <FormField
                                        control={form.control}
                                        name="avatarUrl"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormControl>                                                    
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Avatar del usuario (opcional, max 5MB, JPG/PNG/GIF)
                                                </FormDescription>
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
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UsuarioPage;
