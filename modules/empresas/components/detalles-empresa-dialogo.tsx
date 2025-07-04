"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Empresa } from "../types/empresas"
import Image from "next/image"
import { Building2, Contact, Mail, Phone, Plus, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CompanyDetailsDialogProps {
    empresa: Empresa
    children: React.ReactNode
}

const DetallesEmpresaDialogo = ({
    empresa,
    children
}: CompanyDetailsDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {empresa.logoUrl ? (
                            <Image
                                src={empresa.logoUrl || "/placeholder.svg"}
                                alt={`${empresa.nombre} logo`}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <div className="text-xl font-semibold">{empresa.nombre}</div>
                            <div className="text-sm text-muted-foreground font-normal">{empresa.razonSocial || empresa.rfc}</div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="contactos" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="contactos" className="flex items-center gap-2">
                            <Contact className="h-4 w-4" />
                            Contactos ({empresa.contactos?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="areas" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Áreas ({empresa.areas?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contactos" className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Contactos de la Empresa</h3>
                            <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Contacto
                            </Button>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                            {empresa.contactos && empresa.contactos.length > 0 ? (
                                <div className="space-y-4">
                                    {empresa.contactos.map((contacto, index) => (
                                        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-semibold text-base">{contacto.nombre}</h4>
                                                                {contacto.principal && (
                                                                    <Badge variant="default" className="text-xs">
                                                                        Principal
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{contacto.cargo}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-13">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                            <a href={`mailto:${contacto.email}`} className="text-blue-600 hover:underline truncate">
                                                                {contacto.email}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                            <a href={`tel:${contacto.telefono}`} className="hover:underline">
                                                                {contacto.telefono}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm">
                                                        Editar
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Contact className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h4 className="text-lg font-medium mb-2">No hay contactos registrados</h4>
                                    <p className="text-muted-foreground mb-4">
                                        Agrega contactos para mantener la información de comunicación actualizada
                                    </p>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Primer Contacto
                                    </Button>
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="areas" className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Áreas de la Empresa</h3>
                            <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Área
                            </Button>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                            {empresa.areas && empresa.areas.length > 0 ? (
                                <div className="space-y-4">
                                    {empresa.areas.map((area, index) => (
                                        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Building2 className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-base">{area.nombre}</h4>
                                                            {area.descripcion && (
                                                                <p className="text-sm text-muted-foreground mt-1">{area.descripcion}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {area.correoContacto && (
                                                        <div className="flex items-center gap-2 text-sm ml-13">
                                                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                            <a href={`mailto:${area.correoContacto}`} className="text-blue-600 hover:underline">
                                                                {area.correoContacto}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm">
                                                        Editar
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h4 className="text-lg font-medium mb-2">No hay áreas registradas</h4>
                                    <p className="text-muted-foreground mb-4">
                                        Organiza tu empresa creando diferentes áreas o departamentos
                                    </p>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Primera Área
                                    </Button>
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default DetallesEmpresaDialogo