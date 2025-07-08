"use client"
import { CustomAlertDialog } from "@/components/custom/custom-alert-dialog"
import { ContactInfoInput } from "@/modules/empresas/types/contactos"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Mail, Phone, Star, Trash } from "lucide-react"
import { deleteContactoByEmail } from "../actions/write"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import EditContactModal from "./edit-contacto-modal"

const ContactCard = ({
    contacto,
    empresaId
}: {
    contacto: ContactInfoInput,
    empresaId: string
}) => {
    const router = useRouter()

    const deleteContact = async (empresaId: string, email: string) => {
        try {
            await deleteContactoByEmail(empresaId, email)
            console.log(empresaId);


            toast.success("El contacto se eliminó correctamente")
            router.refresh()
        } catch (error) {
            console.log(error);
            toast.error("Hubo un error al eliminar el contacto", {
                description: `${error}`
            })
        }
    }

    return (
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
            <CardFooter className="flex items-center justify-end gap-2">
                <EditContactModal contacto={contacto} empresaId={empresaId} />

                <CustomAlertDialog
                    action={() => deleteContact(empresaId, contacto.email)}
                    description="¿Estás seguro de querer eliminar este contacto?"
                    title="Eliminar contacto"
                >
                    <Button variant={"destructive"}>
                        <Trash className="w-4 h-4 mr-2" />
                        Eliminar
                    </Button>
                </CustomAlertDialog>
            </CardFooter>
        </Card>
    )
}

export default ContactCard