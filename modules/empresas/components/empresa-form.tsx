"use client"

import { AlertCircle, Award, Briefcase, Building, Building2, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Clipboard, Clock, Copy, ExternalLink, Eye, EyeOff, FileText, Globe, Layers, Mail, MapPin, MapPinIcon, Phone, Plus, Settings, Shield, Trash2, TrendingUp, Users, X } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmpresaSchema, EmpresaSchemaType } from "@/modules/empresas/schema/empresa.schema"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { EmpresaFormSteps } from "@/modules/administracion/constants/form-steps"
import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa"
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { industrias } from "@/modules/empresas/constants/industrias"
import UploadImage from "@/components/custom/upload-image-firebase"
import { writeEmpresa } from "@/modules/empresas/actions/write"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFieldArray, useForm } from "react-hook-form"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import React, { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import {v4 as uuidV4} from "uuid"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const EmpresaForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [useCamera, setUseCamera] = useState(false)

    const form = useForm<EmpresaSchemaType>({
        resolver: zodResolver(EmpresaSchema),
        mode: "onTouched",
        defaultValues: {
            accesoPublico: false,
            contactos: [],
            descripcion: "",
            direccion: "",
            direccionWeb: "",
            email: "",
            nombre: "",
            estado: EstadoEmpresa.Activa,
            fechaCreacion: new Date(),
            industria: "",
            logoUrl: "",
            notificacionesEmail: false,
            numeroEmpleados: "0",
            razonSocial: "",
            reportesAutomaticos: false,
            rfc: "",
            telefono: "",
            tipoEmpresa: TipoEmpresa.Matriz,
            areas: []
        }
    })

    const nextStep = async () => {
        let fieldsToValidate: (keyof EmpresaSchemaType)[] = [];

        switch (currentStep) {
            case 1:
                fieldsToValidate = [
                    "nombre",
                    "rfc",
                    "razonSocial",
                    "direccion",
                    "email",
                    "telefono",
                    "direccionWeb"
                ]
                break;
            case 2:
                fieldsToValidate = [
                    "logoUrl",
                    "industria",
                    "numeroEmpleados",
                    "tipoEmpresa",
                    "descripcion",
                    "estado",
                    "fechaCreacion"
                ];
                break;
            case 3:
                fieldsToValidate = [
                    "contactos"
                ];
                break;
            case 4:
                fieldsToValidate = [
                    "notificacionesEmail",
                    "reportesAutomaticos",
                    "accesoPublico"
                ];
                break;
        }

        const valid = await form.trigger(fieldsToValidate);
        if (valid) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const calculateProgress = (values: EmpresaSchemaType) => {
        const requiredFields = ["nombre", "rfc", "direccion", "email", "telefono"];
        const optionalFields = ["logoUrl", "razonSocial", "sitioWeb", "industria", "descripcion"];

        const isFilled = (value: unknown) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0);

        const requiredCompleted = requiredFields.filter(
            (field) => isFilled(values[field as keyof EmpresaSchemaType])
        ).length;

        const optionalCompleted = optionalFields.filter(
            (field) => isFilled(values[field as keyof EmpresaSchemaType])
        ).length;

        const totalFields = requiredFields.length + optionalFields.length;
        const completedFields = requiredCompleted + optionalCompleted;

        return Math.round((completedFields / totalFields) * 100);
    };

    const getStatusColor = (estado: EstadoEmpresa) => {
        switch (estado) {
            case "activa":
                return "bg-green-100 dark:bg-green-200 text-green-800 border-green-200"
            case "cerrada":
                return "bg-red-100 dark:bg-red-200 text-red-800 border-red-200"
            case "suspendida":
                return "bg-yellow-100 dark:bg-yellow-200 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 dark:bg-gray-200 text-gray-800 border-gray-200"
        }
    }

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < currentStep) return "completed"
        if (stepIndex === currentStep) return "current"
        return "upcoming"
    }

    const rfc = form.watch("rfc")
    const allValues = form.watch();
    const nombreEmpresa = form.watch("nombre");
    const estadoEmpresa = form.watch("estado")
    const progress = calculateProgress(allValues);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "contactos",
    });

    const { fields: areaFields, append: areaAppend, remove: areaRemove } = useFieldArray({
        control: form.control,
        name: "areas",
    });

    useEffect(() => {
        if (nombreEmpresa) {
            form.setValue(
                "direccionWeb",
                `https://grupodiazalvarez/empresa/${nombreEmpresa}`
            );
        } else {
            form.setValue("direccionWeb", "Generando...");
        }
    }, [nombreEmpresa, form]);

    const onClickCopyRfc = () => {
        navigator.clipboard.writeText(rfc)

        toast.success("RFC COPIADO CON EXITO", {
            description: `${rfc}`,
            icon: (
                <Clipboard />
            )
        })
    }

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    const onSubmit = (data: EmpresaSchemaType) => {
        try {
            setIsLoading(true)

            toast.promise(
                writeEmpresa({
                    configuraciones: {
                        accesoPublico: data.accesoPublico,
                        notificacionesEmail: data.notificacionesEmail,
                        reportesAutomaticos: data.reportesAutomaticos
                    },
                    contactos: data.contactos.map(contacto => ({
                        nombre: contacto.nombre,
                        email: contacto.email,
                        telefono: contacto.telefono,
                        cargo: contacto.cargo,
                        principal: contacto.principal
                    })),
                    direccion: data.direccion,
                    email: data.email,
                    estado: data.estado,
                    nombre: data.nombre,
                    rfc: data.rfc,
                    telefono: data.telefono,
                    areas: data.areas.map(area => ({
                        nombre: area.nombre,
                        usuarios: [],
                        correoContacto: area.correoContacto,
                        descripcion: area.descripcion,
                        responsableId: ""
                    })),
                    descripcion: data.descripcion,
                    direccionWeb: data.direccionWeb,
                    empresaPadreId: "",
                    fechaCierre: new Date(),
                    industria: data.industria,
                    logoUrl: imageUrl,
                    numeroEmpleados: data.numeroEmpleados,
                    razonSocial: data.razonSocial,
                    tipo: data.tipoEmpresa,
                    usuarios: []
                }), {
                loading: "Creando empresa favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return "Empresa registrada satisfactoriamente.";
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar la empresa.";
                },
            })

            form.reset()
            window.location.reload()
        } catch (error) {
            console.log("Error al crear al usuario", error);
            toast.error("Error al crear al suario", {
                description: `${error}`
            })

        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        form.reset()
        window.location.reload()
    }

    return (
        <div className="w-full mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Registro de Empresa</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-200">Complete la información paso a paso</p>
                    </div>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-200">
                        <span>Progreso del formulario</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12">
                <nav aria-label="Progress">
                    <ol className="flex items-center justify-between">
                        {EmpresaFormSteps.map((step, stepIndex) => {
                            const status = getStepStatus(stepIndex)
                            const Icon = step.icon

                            return (
                                <li key={step.id} className="relative flex-1">
                                    <div className="flex">
                                        <div className="relative flex">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${status === "completed"
                                                    ? "bg-red-600 border-red-600"
                                                    : status === "current"
                                                        ? "bg-blue-50 border-red-600"
                                                        : "bg-white border-gray-300"
                                                    }`}
                                            >
                                                {status === "completed" ? (
                                                    <Check className="h-6 w-6 text-white" />
                                                ) : (
                                                    <Icon className={`h-6 w-6 ${status === "current" ? "text-red-600" : "text-gray-400"}`} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 min-w-0 flex-1">
                                            <p
                                                className={`text-sm font-medium ${status === "current"
                                                    ? "text-red-600"
                                                    : status === "completed"
                                                        ? "text-gray-900 dark:text-gray-500"
                                                        : "text-gray-500 dark:text-gray-200"
                                                    }`}
                                            >
                                                {step.title}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">{step.description}</p>
                                        </div>
                                    </div>
                                    {stepIndex < EmpresaFormSteps.length - 1 && (
                                        <div
                                            className={`absolute top-6 left-12 w-full h-0.5 ${stepIndex < currentStep ? "bg-red-600" : "bg-gray-300"
                                                }`}
                                            style={{ width: "calc(100% - 3rem)" }}
                                        />
                                    )}
                                </li>
                            )
                        })}
                    </ol>
                </nav>
            </div>

            <div className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ease-in-out"
            )}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn("space-y-6 transition-all duration-500 ease-in-out", !nombreEmpresa ? "col-span-2" : "col-span-1")}
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {React.createElement(EmpresaFormSteps[currentStep].icon, { className: "h-5 w-5" })}
                                    {EmpresaFormSteps[currentStep].title}
                                </CardTitle>
                                <CardDescription>{EmpresaFormSteps[currentStep].description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentStep === 0 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="nombre"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2 cursor-not-allowed">
                                                            <FormLabel className="text-sm font-medium">
                                                                Nombre de la Empresa
                                                                <span className="text-destructive ml-1">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Ej. Combustibles Baja Sur"
                                                                    className="h-10"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="rfc"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2 cursor-not-allowed">
                                                            <FormLabel className="text-sm font-medium">
                                                                RFC
                                                                <span className="text-destructive ml-1">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        placeholder="Ej. DIAF681013A40"
                                                                        className="h-10"
                                                                        maxLength={13}
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                                    />

                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                                                                onClick={onClickCopyRfc}
                                                                            >
                                                                                <Copy className="h-3 w-3" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            Copiar RFC
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription>
                                                                Formato: 3-4 letras + 6 números + 3 caracteres
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="razonSocial"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2 cursor-not-allowed">
                                                        <FormLabel className="text-sm font-medium">
                                                            Razon social
                                                            <span className="text-destructive ml-1">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Razon social completa de la empresa"
                                                                className="h-10"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nombre legal completo de la empresa
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="direccion"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2 cursor-not-allowed">
                                                        <FormLabel className="text-sm font-medium">
                                                            Direccion
                                                            <span className="text-destructive ml-1">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Calle, número, colonia, ciudad, estado, código postal"
                                                                className={`min-h-[100px] ${form.formState.errors.direccion ? "border-red-500" : ""}`}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2 cursor-not-allowed">
                                                            <FormLabel className="text-sm font-medium">
                                                                Email
                                                                <span className="text-destructive ml-1">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        placeholder="Ej. empresa@grupodiazalvarez.com"
                                                                        className="h-10 pl-10"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="telefono"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2 cursor-not-allowed">
                                                            <FormLabel className="text-sm font-medium">
                                                                Numero telefonico
                                                                <span className="text-destructive ml-1">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        placeholder="(+52) 6121206778"
                                                                        className="h-10 pl-10"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="direccionWeb"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2 cursor-not-allowed">
                                                            <FormLabel className="text-sm font-medium">
                                                                Direccion Web
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        className="h-10 pl-10"
                                                                        disabled
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="w-full space-y-6">
                                                    <div className="p-6 rounded-lg shadow-md">
                                                        <UploadImage
                                                            path={`empresas/${nombreEmpresa}`}
                                                            id={uuidV4()}
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

                                                <div className="grid grid-cols-1 gap-2 h-fit place-self-top w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="industria"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                                <FormLabel className="text-sm font-medium">
                                                                    Industria
                                                                    <span className="text-destructive ml-1">*</span>
                                                                </FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Tipo de industria de la empresa" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {industrias.map((i) => (
                                                                            <SelectItem key={i} value={i}>
                                                                                {i}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="tipoEmpresa"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                                <FormLabel className="text-sm font-medium">
                                                                    Tipo de empresa
                                                                    <span className="text-destructive ml-1">*</span>
                                                                </FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value={TipoEmpresa.Matriz}>
                                                                            <div className="flex items-center gap-2">
                                                                                <Building className="h-4 w-4" />
                                                                                Matriz
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value={TipoEmpresa.Sucursal}>
                                                                            <div className="flex items-center gap-2">
                                                                                <Building2 className="h-4 w-4" />
                                                                                Sucursal
                                                                            </div>
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="numeroEmpleados"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                                <FormLabel className="text-sm font-medium">
                                                                    Numero de empleados
                                                                    <span className="text-destructive ml-1">*</span>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Ej. 50"
                                                                        className="h-10"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="descripcion"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2 cursor-not-allowed">
                                                        <FormLabel className="text-sm font-medium">
                                                            Descripción de la Empresa
                                                            <span className="text-destructive ml-1">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Descripción breve de la empresa, sus servicios y objetivos..."
                                                                className="min-h-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-end">
                                                <div className="space-y-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="estado"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-2 cursor-not-allowed w-full">
                                                                <FormLabel className="text-sm font-medium mb-1">
                                                                    Estado de la empresa
                                                                    <span className="text-destructive ml-1">*</span>
                                                                </FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value={EstadoEmpresa.Activa}>
                                                                            <div className="flex items-center gap-2">
                                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                                Activa
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value={EstadoEmpresa.Suspendida}>
                                                                            <div className="flex items-center gap-2">
                                                                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                                                Suspendida
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value={EstadoEmpresa.Cerrada}>
                                                                            <div className="flex items-center gap-2">
                                                                                <X className="h-4 w-4 text-red-500" />
                                                                                Cerrada
                                                                            </div>
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    {estadoEmpresa === EstadoEmpresa.Suspendida && (
                                                        <Alert>
                                                            <AlertCircle className="h-4 w-4" />
                                                            <AlertDescription>
                                                                Una empresa suspendida tiene acceso limitado al sistema. Contacte al administrador para más
                                                                información.
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>

                                                <DatePickerForm<EmpresaSchemaType>
                                                    label="Fecha de creacion"
                                                    name="fechaCreacion"
                                                    disabled={isLoading}
                                                    className="w-full space-y-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <Layers className="h-5 w-5" />
                                                    Áreas de la Empresa
                                                </h3>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => {
                                                        areaAppend({
                                                            correoContacto: "",
                                                            empresaId: "",
                                                            nombre: "",
                                                            descripcion: "",
                                                            responsableId: ""
                                                        })
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Nueva Área
                                                </Button>
                                            </div>
                                        </div>

                                        {areaFields.length === 0 ? (
                                            <div className="space-y-2">
                                                <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                                                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                    <p>No hay areas agregados</p>
                                                    <p className="text-sm">Haga clic en "Nueva Área" para comenzar</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "space-y-4 grid grid-cols-1 gap-6",
                                                areaFields.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
                                            )}>
                                                {areaFields.map((area, index) => (
                                                    <Card key={index} className="border-l-4 border-l-blue-500">
                                                        <CardContent className="p-4">
                                                            <div className="flex justify-end items-start mb-4 w-full">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => areaRemove(index)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`areas.${index}.nombre`}
                                                                        render={({ field }) => (
                                                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                                                <FormLabel className="text-sm font-medium">
                                                                                    Nombre del area
                                                                                    <span className="text-destructive ml-1">*</span>
                                                                                </FormLabel>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        placeholder=""
                                                                                        className="h-10"
                                                                                        {...field}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`areas.${index}.correoContacto`}
                                                                        render={({ field }) => (
                                                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                                                <FormLabel className="text-sm font-medium">
                                                                                    Correo de contacto
                                                                                    <span className="text-destructive ml-1">*</span>
                                                                                </FormLabel>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        placeholder=""
                                                                                        className="h-10"
                                                                                        {...field}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2 mt-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`areas.${index}.descripcion`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="space-y-2 cursor-not-allowed">
                                                                            <FormLabel className="text-sm font-medium">
                                                                                Descripcion del area
                                                                                <span className="text-destructive ml-1">*</span>
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Textarea
                                                                                    placeholder=""
                                                                                    className="min-h-[80px]"
                                                                                    {...field}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Agregue los contactos principales de la empresa
                                            </p>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    append({
                                                        nombre: "",
                                                        cargo: "",
                                                        email: "",
                                                        telefono: "",
                                                        principal: false,
                                                    })
                                                }
                                                size="sm"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar Contacto
                                            </Button>
                                        </div>

                                        {fields.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                                                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                <p>No hay contactos agregados</p>
                                                <p className="text-sm">Haga clic en "Agregar Contacto" para comenzar</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {fields.map((contact, index) => {
                                                    const isPrincipal = form.watch(`contactos.${index}.principal`);

                                                    return (
                                                        <Card key={index} className="border-l-4 border-l-blue-500">
                                                            <CardContent className="p-4">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant={isPrincipal ? "default" : "secondary"}>
                                                                            {isPrincipal ? "Principal" : "Secundario"}
                                                                        </Badge>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => remove(index)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`contactos.${index}.nombre`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-2 cursor-not-allowed">
                                                                                    <FormLabel className="text-sm font-medium">
                                                                                        Nombre contacto
                                                                                        <span className="text-destructive ml-1">*</span>
                                                                                    </FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            placeholder=""
                                                                                            className="h-10"
                                                                                            {...field}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`contactos.${index}.cargo`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-2 cursor-not-allowed">
                                                                                    <FormLabel className="text-sm font-medium">
                                                                                        Cargo contacto
                                                                                        <span className="text-destructive ml-1">*</span>
                                                                                    </FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            placeholder=""
                                                                                            className="h-10"
                                                                                            {...field}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`contactos.${index}.email`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-2 cursor-not-allowed">
                                                                                    <FormLabel className="text-sm font-medium">
                                                                                        Email contacto
                                                                                        <span className="text-destructive ml-1">*</span>
                                                                                    </FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            placeholder=""
                                                                                            className="h-10"
                                                                                            {...field}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`contactos.${index}.telefono`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-2 cursor-not-allowed">
                                                                                    <FormLabel className="text-sm font-medium">
                                                                                        Telefono contacto
                                                                                        <span className="text-destructive ml-1">*</span>
                                                                                    </FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            placeholder=""
                                                                                            className="h-10"
                                                                                            {...field}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="mt-4 flex items-center space-x-2">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`contactos.${index}.principal`}
                                                                        render={({ field }) => (
                                                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                                                <div className="space-y-0.5">
                                                                                    <FormLabel>Es principal?</FormLabel>
                                                                                    <FormDescription>
                                                                                        Contacto principal de la empresa
                                                                                    </FormDescription>
                                                                                </div>
                                                                                <FormControl>
                                                                                    <Switch
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-0.5 w-full">
                                                <FormField
                                                    control={form.control}
                                                    name={"notificacionesEmail"}
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Notificaciones por email</FormLabel>
                                                                <FormDescription>
                                                                    Recibir notificaciones importantes por correo electrónico
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>
                                            <Separator />

                                            <div className="space-y-0.5 w-full">
                                                <FormField
                                                    control={form.control}
                                                    name={"reportesAutomaticos"}
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Reportes Automáticos</FormLabel>
                                                                <FormDescription>
                                                                    Generar y enviar reportes automáticamente
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Separator />
                                            <div className="space-y-0.5 w-full">
                                                <FormField
                                                    control={form.control}
                                                    name={"accesoPublico"}
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Acceso Público</FormLabel>
                                                                <FormDescription>
                                                                    Permitir acceso público a información básica de la empresa
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Guardar Empresa
                                            </>
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center bg-gray-50 dark:bg-card p-6 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-white">
                                <p>
                                    Paso {currentStep + 1} de {EmpresaFormSteps.length}
                                </p>
                                <p>* Campos obligatorios</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className={cn(
                                        "bg-transparent",
                                        currentStep === 0 && "cursor-not-allowed"
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Anterior
                                </Button>
                                {currentStep < EmpresaFormSteps.length - 1 && (
                                    <Button type="button" onClick={nextStep}>
                                        Siguiente
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => resetForm()}
                                className="text-gray-500 dark:text-gray-300">

                                Cancelar y Limpiar Formulario
                            </Button>
                        </div>
                    </form>
                </Form>

                {nombreEmpresa && (
                    <Card className="border-2 border-red-200 dark:border-red-600 bg-gradient-to-br 
                        dark:bg-card shadow-lg transition-all duration-500 ease-in-out">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Eye className="h-6 w-6 text-red-600 dark:text-white" />
                                Vista Previa de la Empresa
                            </CardTitle>
                            <CardDescription className="dark:text-white">Así se verá la información de su empresa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-background rounded-xl p-6 shadow-sm border">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-shrink-0">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt="Logo"
                                                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center border-2 border-red-200">
                                                    <Building className="h-12 w-12 text-red-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">{nombreEmpresa}</h2>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Badge className={`px-3 py-1 ${getStatusColor(form.watch("estado"))}`}>
                                                        <div className="flex items-center gap-1">
                                                            {form.watch("estado") === "activa" && <CheckCircle2 className="h-3 w-3" />}
                                                            {form.watch("estado") === "cerrada" && <X className="h-3 w-3" />}
                                                            {form.watch("estado") === "suspendida" && <AlertCircle className="h-3 w-3" />}
                                                            {form.watch("estado").charAt(0).toUpperCase() + form.watch("estado").slice(1)}
                                                        </div>
                                                    </Badge>
                                                    {form.watch("tipoEmpresa") && (
                                                        <Badge variant="outline" className="px-3 py-1">
                                                            <Building2 className="h-3 w-3 mr-1" />
                                                            {form.watch("tipoEmpresa").charAt(0).toUpperCase() + form.watch("tipoEmpresa").slice(1)}
                                                        </Badge>
                                                    )}
                                                    {form.watch("industria") && (
                                                        <Badge variant="secondary" className="px-3 py-1">
                                                            <Briefcase className="h-3 w-3 mr-1" />
                                                            {form.watch("industria")}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="font-medium">RFC:</span>
                                                        <span className="font-mono">{form.watch("rfc")}</span>
                                                    </div>
                                                    {form.watch("razonSocial") && (
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                                                            <Building className="h-4 w-4" />
                                                            <span className="font-medium">Razón Social:</span>
                                                            <span>{form.watch("razonSocial")}</span>
                                                        </div>
                                                    )}
                                                    {form.watch("numeroEmpleados") && (
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                                                            <Users className="h-4 w-4" />
                                                            <span className="font-medium">Empleados:</span>
                                                            <span>{form.watch("numeroEmpleados")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                                                        <CalendarDays className="h-4 w-4" />
                                                        <span className="font-medium">Creada:</span>
                                                        <span>{format(new Date(), "PPP", { locale: es })}</span>
                                                    </div>
                                                    {form.watch("fechaCreacion") && (
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                                                            <Clock className="h-4 w-4" />
                                                            <span className="font-medium">Fecha de Cierre:</span>
                                                            <span>{format(form.watch("fechaCreacion"), "PPP", { locale: es })}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-white dark:bg-background shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <MapPinIcon className="h-5 w-5 text-white" />
                                                Información de Contacto
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-4 w-4 text-gray-400 dark:text-white mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Dirección</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-100">{form.watch("direccion")}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-gray-400 dark:text-white flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Email</p>
                                                    <a
                                                        href={`mailto:${form.watch("email")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {form.watch("email")}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-gray-400 dark:text-white flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Teléfono</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-100">{form.watch("telefono")}</p>
                                                </div>
                                            </div>
                                            {form.watch("direccionWeb") && (
                                                <div className="flex items-center gap-3">
                                                    <Globe className="h-4 w-4 text-gray-400 dark:text-white flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Sitio Web</p>
                                                        <a
                                                            href={form.watch("direccionWeb")}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            {form.watch("direccionWeb")}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white dark:bg-background shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                                Estadísticas
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 flex flex-col items-center justify-center w-full">
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-200 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{form.watch("areas").length}</div>
                                                    <div className="text-xs text-gray-600">
                                                        {form.watch("areas").length > 1 ? "Áreas" : "Área"}
                                                    </div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 dark:bg-green-200 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{form.watch("contactos").length}</div>
                                                    <div className="text-xs text-gray-600">
                                                        {form.watch("contactos").length > 1 ? "Contactos" : "Contacto"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Completitud del perfil</span>
                                                    <span className="text-sm font-medium">{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {form.watch("descripcion") && (
                                    <Card className="bg-white dark:bg-background shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-red-600" />
                                                Descripción de la Empresa
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{form.watch("descripcion")}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {form.watch("areas").length > 0 && (
                                        <Card className={
                                            cn("bg-white dark:bg-background shadow-sm", form.watch("contactos").length === 0 && "col-span-2")
                                        }>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Award className="h-5 w-5 text-orange-600" />
                                                    Áreas de la Empresa
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {form.watch("areas").map((area) => (
                                                        <div key={area.nombre} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-card rounded-lg">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900 dark:text-gray-400 capitalize">{area.nombre}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-200">{area.descripcion}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {form.watch("contactos").length > 0 && (
                                        <Card className={
                                            cn("bg-white dark:bg-background shadow-sm", form.watch("areas").length === 0 && "col-span-2")
                                        }>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-red-600" />
                                                    Contactos Principales
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className={cn(
                                                    "space-y-4 grid gap-6",
                                                    form.watch("areas").length === 0 ? "grid-cols-3" : "grid-cols-1"
                                                )}>
                                                    {form.watch("contactos").slice(0, 3).map((contact, index) => (
                                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-card rounded-lg">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full 
                                                                flex items-center justify-center text-white font-medium">
                                                                {contact.nombre.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-900 dark:text-gray-300">{contact.nombre}</p>
                                                                    {contact.principal && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            Principal
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-200">{contact.cargo}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-100">{contact.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {form.watch("contactos").length > 3 && (
                                                        <div className={`${form.watch("areas").length === 0 && "col-span-3"}`}>
                                                            <p className="text-sm text-gray-500 text-center">
                                                                +{form.watch("contactos").length - 3} contactos más
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                <Card className="bg-white dark:bg-background shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-gray-600 dark:text-white" />
                                            Configuraciones
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${form.watch("notificacionesEmail") ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <span className="text-sm text-gray-700 dark:text-white">Notificaciones Email</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${form.watch("reportesAutomaticos") ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <span className="text-sm text-gray-700 dark:text-white">Reportes Automáticos</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${form.watch("accesoPublico") ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <span className="text-sm text-gray-700 dark:text-white">Acceso Público</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default EmpresaForm