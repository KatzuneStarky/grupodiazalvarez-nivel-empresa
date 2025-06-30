"use client"

import { Building, Building2, Check, CheckCircle2, ChevronLeft, ChevronRight, Clipboard, Copy, Eye, EyeOff, Globe, Mail, Phone } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmpresaSchema, EmpresaSchemaType } from "@/modules/empresas/schema/empresa.schema"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { EmpresaFormSteps } from "@/modules/administracion/constants/form-steps"
import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa"
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa"
import UploadImage from "@/components/custom/upload-image-firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const EmpresasPage = () => {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const [tooltipText, setIsTooltipText] = useState<string>("")
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
            tipoEmpresa: TipoEmpresa.Matriz
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
    const progress = calculateProgress(allValues);

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
        setIsTooltipText("¡Copiado!");

        toast.success("RFC COPIADO CON EXITO", {
            description: `${rfc}`,
            icon: (
                <Clipboard />
            )
        })

        setTimeout(() => {
            setIsTooltipText("Copiar RFC");
        }, 2000);
    }

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    const onSubmit = (data: EmpresaSchemaType) => {

    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
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

            <div className="max-w-4xl mx-auto mt-12">
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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </div>
    )
}

export default EmpresasPage