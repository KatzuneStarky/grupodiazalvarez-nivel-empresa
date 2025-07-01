"use client"

import { AlertCircle, Award, Briefcase, Building, Building2, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Clipboard, Clock, Copy, ExternalLink, Eye, EyeOff, FileText, Globe, Mail, MapPin, MapPinIcon, Phone, Plus, Settings, Shield, Trash2, TrendingUp, Users, X } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmpresaSchema, EmpresaSchemaType } from "@/modules/empresas/schema/empresa.schema"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { EmpresaFormSteps } from "@/modules/administracion/constants/form-steps"
import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa"
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import UploadImage from "@/components/custom/upload-image-firebase"
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
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const EmpresasPage = () => {
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [useCamera, setUseCamera] = useState(false)
    const [id, setId] = useState<string>("")

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
                return "bg-green-100 text-green-800 border-green-200"
            case "cerrada":
                return "bg-red-100 text-red-800 border-red-200"
            case "suspendida":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
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
        } catch (error) {
            console.log("Error al crear al usuario", error);
            toast.error("Error al crear al suario", {
                description: `${error}`
            })

        } finally {
            setIsLoading(false)
        }
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

            <div className="flex justify-center">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPreview ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
                </Button>
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
                                                            id={id}
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

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-fit place-self-top w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="industria"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                                <FormLabel className="text-sm font-medium">
                                                                    Industria (datos de prueba)
                                                                    <span className="text-destructive ml-1">*</span>
                                                                </FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
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

                                        <Separator />
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Áreas de la Empresa</h3>
                                            {/**
                                         * <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Áreas Disponibles</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {availableAreas.map((area) => (
                                                        <Button
                                                            key={area.id}
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addArea(area)}
                                                            disabled={formData.areas.some((a) => a.id === area.id)}
                                                            className="justify-start h-auto p-3"
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium">{area.nombre}</div>
                                                                <div className="text-xs text-gray-500">{area.descripcion}</div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {formData.areas.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label>Áreas Seleccionadas ({formData.areas.length})</Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {formData.areas.map((area) => (
                                                            <div key={area.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                                <div>
                                                                    <div className="font-medium">{area.nombre}</div>
                                                                    <div className="text-xs text-gray-500">{area.descripcion}</div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeArea(area.id)}
                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                         */}
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
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

                                {currentStep === 3 && (
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
                                                    name={"notificacionesEmail"}
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
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-950 p-6 rounded-lg">
                            <div className="text-sm text-gray-600">
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
                                {currentStep < EmpresaFormSteps.length - 1 ? (
                                    <Button type="button" onClick={nextStep}>
                                        Siguiente
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                ) : (
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
                            </div>
                        </div>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { }}
                                className="text-gray-500 dark:text-gray-300">

                                Cancelar y Limpiar Formulario
                            </Button>
                        </div>
                    </form>
                </Form>

                {nombreEmpresa && (
                    <Card className="border-2 border-blue-200 dark:border-blue-600 bg-gradient-to-br 
                        from-blue-50 dark:from-red-800 dark:to-orange-800 to-indigo-50 shadow-lg transition-all duration-500 ease-in-out">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Eye className="h-6 w-6 text-blue-600 dark:text-black" />
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
                                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-blue-200">
                                                    <Building className="h-12 w-12 text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{nombreEmpresa}</h2>
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
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="font-medium">RFC:</span>
                                                        <span className="font-mono">{form.watch("rfc")}</span>
                                                    </div>
                                                    {form.watch("razonSocial") && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Building className="h-4 w-4" />
                                                            <span className="font-medium">Razón Social:</span>
                                                            <span>{form.watch("razonSocial")}</span>
                                                        </div>
                                                    )}
                                                    {form.watch("numeroEmpleados") && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Users className="h-4 w-4" />
                                                            <span className="font-medium">Empleados:</span>
                                                            <span>{form.watch("numeroEmpleados")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <CalendarDays className="h-4 w-4" />
                                                        <span className="font-medium">Creada:</span>
                                                        <span>{format(new Date(), "PPP", { locale: es })}</span>
                                                    </div>
                                                    {form.watch("fechaCreacion") && (
                                                        <div className="flex items-center gap-2 text-gray-600">
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
                                    <Card className="bg-white shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <MapPinIcon className="h-5 w-5 text-blue-600" />
                                                Información de Contacto
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Dirección</p>
                                                    <p className="text-sm text-gray-600">{form.watch("direccion")}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                                    <p className="text-sm text-blue-600">{form.watch("email")}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                                                    <p className="text-sm text-gray-600">{form.watch("telefono")}</p>
                                                </div>
                                            </div>
                                            {form.watch("direccionWeb") && (
                                                <div className="flex items-center gap-3">
                                                    <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Sitio Web</p>
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

                                    <Card className="bg-white shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                                Estadísticas
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{form.watch("areas").length}</div>
                                                    <div className="text-xs text-gray-600">Áreas</div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{form.watch("contactos").length}</div>
                                                    <div className="text-xs text-gray-600">Contactos</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Completitud del perfil</span>
                                                    <span className="text-sm font-medium">{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-green-500" />
                                                <span className="text-gray-600">Perfil verificado</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {form.watch("descripcion") && (
                                    <Card className="bg-white shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-purple-600" />
                                                Descripción de la Empresa
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 leading-relaxed">{form.watch("descripcion")}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {form.watch("areas").length > 0 && (
                                        <Card className="bg-white shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Award className="h-5 w-5 text-orange-600" />
                                                    Áreas de la Empresa
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {form.watch("areas").map((area) => (
                                                        <div key={area.nombre} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{area.nombre}</p>
                                                                <p className="text-xs text-gray-500">{area.descripcion}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {form.watch("contactos").length > 0 && (
                                        <Card className="bg-white shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-indigo-600" />
                                                    Contactos Principales
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {form.watch("contactos").slice(0, 3).map((contact, index) => (
                                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                                {contact.nombre.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-900">{contact.nombre}</p>
                                                                    {contact.principal && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            Principal
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600">{contact.cargo}</p>
                                                                <p className="text-xs text-gray-500">{contact.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {form.watch("contactos").length > 3 && (
                                                        <p className="text-sm text-gray-500 text-center">
                                                            +{form.watch("contactos").length - 3} contactos más
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Configuration Summary */}
                                <Card className="bg-white shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-gray-600" />
                                            Configuraciones
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${true ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <span className="text-sm text-gray-700">Notificaciones Email</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${true ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <span className="text-sm text-gray-700">Reportes Automáticos</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${true ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <span className="text-sm text-gray-700">Acceso Público</span>
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

export default EmpresasPage