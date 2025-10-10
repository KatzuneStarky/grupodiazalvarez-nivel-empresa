"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import DeleteClientDialog from "@/modules/logistica/clientes/components/delete-cliente-dialog"
import { exportClientes } from "@/functions/excel-export/clientes/export/export-clientes"
import { useClientes } from "@/modules/logistica/bdd/clientes/hooks/use-clientes"
import { Edit, Mail, MapPin, Phone, Plus, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { IconFileExport } from "@tabler/icons-react"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const ClientsPage = () => {
    const { directLink } = useDirectLink("/clientes")
    const { clientes } = useClientes()
    const router = useRouter()
    const { area } = useArea()

    const handleExportClientes = async () => {
        try {
            toast.promise(exportClientes(clientes || [], area?.nombre || ""), {
                loading: "Exportando datos...",
                success: "Datos exportados existosamente",
                error: "Error al exportar los datos"
            })
        } catch (error) {
            console.error(error)
            toast.error("Error al exportar los datos", {
                description: `${error}`
            })
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <PageTitle
                title="Clientes"
                description="Gestiona la información de tus clientes"
                icon={<User className="h-12 w-12 text-primary" />}
                hasActions
                actions={
                    <>
                        <Button
                            className="sm:w-auto"
                            onClick={() => handleExportClientes()}
                        >
                            <IconFileExport className="w-4 h-4 mr-2" />
                            Exportar Datos
                        </Button>
                        <Button onClick={() => router.push(`${directLink}/nuevo`)} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Nuevo Cliente
                        </Button>
                    </>
                }
            />
            <Separator className="my-4" />

            {clientes?.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-2xl text-muted-foreground">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">No hay clientes</h3>
                    <p className="text-muted-foreground">Agrega tu primer cliente para comenzar</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {clientes?.map((cliente) => {
                        const primaryContact = cliente.contactos[0]
                        const contactCount = cliente.contactos.length
                        return (
                            <Card
                                className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 
                                border border-border bg-card"
                                key={cliente.id}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-sans font-semibold text-card-foreground text-balance leading-tight line-clamp-2">
                                                {cliente.nombreCorto || cliente.nombreFiscal}
                                            </h3>
                                            {cliente.nombreCorto && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{cliente.nombreFiscal}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${cliente.activo ? "bg-green-500" : "bg-destructive"}`} />
                                            <Badge variant={cliente.activo ? "default" : "destructive"} className="text-xs px-2 py-0.5">
                                                {cliente.activo ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        {cliente.correo && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground truncate">{cliente.correo}</span>
                                            </div>
                                        )}

                                        {primaryContact && (
                                            <div className="flex">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                                    <span className="text-muted-foreground truncate">{primaryContact.telefono}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Contacto: {primaryContact.nombre}
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <span className="font-extrabold underline cursor-pointer">
                                                                {contactCount > 1 && ` (+${contactCount - 1} más)`}
                                                            </span>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-xl font-semibold text-balance">
                                                                    Contactos - {cliente.nombreCorto || cliente.nombreFiscal}
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    {cliente.contactos.length} contacto{cliente.contactos.length !== 1 ? "s" : ""} registrado
                                                                    {cliente.contactos.length !== 1 ? "s" : ""}
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="space-y-4 mt-4">
                                                                {cliente.contactos.map((contacto, index) => (
                                                                    <div key={index} className="space-y-3">
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                                    <User className="h-5 w-5 text-primary" />
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <h4 className="font-medium text-card-foreground text-balance">{contacto.nombre}</h4>
                                                                                </div>
                                                                            </div>
                                                                            {index === 0 && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    Principal
                                                                                </Badge>
                                                                            )}
                                                                        </div>

                                                                        <div className="ml-13 space-y-2">
                                                                            {contacto.telefono && (
                                                                                <div className="flex items-center gap-3 text-sm">
                                                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                                                    <span className="text-muted-foreground">{contacto.telefono}</span>
                                                                                </div>
                                                                            )}

                                                                            {contacto.email && (
                                                                                <div className="flex items-center gap-3 text-sm">
                                                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                                                    <span className="text-muted-foreground">{contacto.email}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {index < cliente.contactos.length - 1 && <Separator className="my-4" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <span className="text-muted-foreground text-xs line-clamp-2">
                                            {cliente.domicilio.municipio}, {cliente.domicilio.estado}, {cliente.domicilio.cp}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                                        <span className="font-mono">RFC: {cliente.rfc}</span>
                                        {cliente.curp && <span className="font-mono">CURP: {cliente.curp}</span>}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs h-8 bg-primary hover:bg-primary/90"
                                            onClick={() => router.push(`${directLink}/editar?clienteId=${cliente.id}`)}
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Editar
                                        </Button>
                                        <DeleteClientDialog clientId={cliente.id || ""} />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ClientsPage