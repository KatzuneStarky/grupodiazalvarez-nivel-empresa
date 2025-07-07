"use client"
import { ContactInfoInput } from "@/modules/empresas/types/contactos"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ContactCard = ({
    contacto
}: {
    contacto: ContactInfoInput
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="ml-4 border-l-4 border-l-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {contacto.nombre
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">{contacto.nombre}</h4>
                                    {contacto.principal && (
                                        <Badge variant="secondary" className="text-xs">
                                            <Star className="h-3 w-3 mr-1" />
                                            Principal
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{contacto.cargo}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${contacto.email}`} className="hover:text-blue-600">
                                {contacto.email}
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${contacto.telefono}`} className="hover:text-blue-600">
                                {contacto.telefono}
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ContactCard