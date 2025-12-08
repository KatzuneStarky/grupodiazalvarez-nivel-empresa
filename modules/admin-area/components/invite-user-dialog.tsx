"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { inviteNewUser, deleteInvitation } from "@/actions/invitaciones/write"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Link, Mail } from "lucide-react"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth"
import { ArrayRoles, RolUsuario } from "@/enum/user-roles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useArea } from "@/context/area-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

const inviteUserSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    role: z.nativeEnum(RolUsuario).default(RolUsuario.usuario)
})

interface InviteUserDialogProps {
    empresaId: string
    areaId: string
    children?: React.ReactNode
}

const InviteUserDialog = ({ empresaId, areaId, children }: InviteUserDialogProps) => {
    const [role, setRole] = useState<RolUsuario>(RolUsuario.usuario)
    const [openRolePopover, setOpenRolePopover] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const { area } = useArea()
    const auth = getAuth()

    const handleInviteUser = async () => {
        const validation = inviteUserSchema.safeParse({
            email: userEmail,
            role
        })

        if (!validation.success) {
            toast.error("Datos inválidos", {
                description: validation.error.errors[0]?.message || "Por favor verifica los datos ingresados"
            })
            return
        }

        setLoading(true)

        toast.promise(
            (async () => {
                const invitation = await inviteNewUser({
                    email: userEmail,
                    empresaId,
                    empresaName: area?.nombre || "",
                    rol: role,
                    areaId
                })

                if (!invitation.success || !invitation.resultId) {
                    throw new Error(invitation.message || "Error al crear la invitación")
                }

                try {
                    const origin = window.location.origin
                    const actionCodeSettings = {
                        url: `${origin}/registro?email=${encodeURIComponent(userEmail)}&invitationId=${invitation.resultId}`,
                        handleCodeInApp: true,
                    }

                    await sendSignInLinkToEmail(auth, userEmail, actionCodeSettings)
                } catch (error) {
                    await deleteInvitation(invitation.resultId)
                    throw new Error("Error al enviar el correo. Intente nuevamente.")
                }

                // Reset form
                setRole(RolUsuario.usuario)
                setUserEmail("")
                setOpen(false)

                return `Invitación enviada a ${userEmail}`
            })(),
            {
                loading: "Enviando invitación...",
                success: (message) => message,
                error: (error) => error.message || "Error al enviar la invitación"
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        <Mail className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Invitar Usuario</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Invitar nuevo usuario</DialogTitle>
                    <DialogDescription>
                        Envía una invitación por correo electrónico para que un nuevo usuario se una al área {area?.nombre}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="usuario@ejemplo.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Rol del usuario</Label>
                        <Popover open={openRolePopover} onOpenChange={setOpenRolePopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openRolePopover}
                                    className="w-full justify-between"
                                    disabled={loading}
                                >
                                    {role
                                        ? ArrayRoles.find((r) => r.value === role)?.label
                                        : "Seleccionar rol..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Buscar rol..." className="h-9" />
                                    <CommandList className="max-h-[200px]">
                                        <CommandEmpty>No se encontró el rol.</CommandEmpty>
                                        <CommandGroup>
                                            {ArrayRoles.map((r) => (
                                                <CommandItem
                                                    key={r.value}
                                                    value={r.value}
                                                    onSelect={() => {
                                                        setRole(r.value as RolUsuario)
                                                        setOpenRolePopover(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            role === r.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {r.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleInviteUser}
                            disabled={loading || !userEmail}
                        >
                            <Link className="h-4 w-4 mr-2" />
                            Enviar invitación
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteUserDialog
