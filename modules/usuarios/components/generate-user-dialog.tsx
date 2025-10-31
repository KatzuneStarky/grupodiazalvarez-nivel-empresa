"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas";
import { Link, UserPlus, Check, ChevronsUpDown } from "lucide-react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { inviteNewUser } from "@/actions/invitaciones/write";
import { ArrayRoles, RolUsuario } from "@/enum/user-roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react"
import { toast } from "sonner";
import { z } from "zod";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const newUserSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    empresaName: z.string().min(1, { message: "Empresa inválida" }),
    empresaId: z.string().min(1, { message: "Empresa inválida" }),
    role: z.nativeEnum(RolUsuario).default(RolUsuario.usuario)
})

const GenerateUserDialog = () => {
    const [role, setRole] = useState<RolUsuario>(RolUsuario.usuario)
    const [openEmpresa, setOpenEmpresa] = useState<boolean>(false)
    const [empresaName, setEmpresaName] = useState<string>("")
    const [userEmail, setUserEmail] = useState<string>("")
    const [empresaId, setEmpresaId] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const { empresas } = useAllEmpreas()
    const auth = getAuth();

    const generateNewUser = async (email: string) => {
        const isValid = newUserSchema.safeParse({
            email,
            empresaName,
            empresaId,
            role
        });

        if (!isValid.success) {
            toast.error("Email inválido");
            return;
        }

        setLoading(true)
        try {
            toast.promise(
                (async () => {
                    const invitation = await inviteNewUser({
                        email,
                        empresaId,
                        empresaName,
                        rol: role
                    });

                    if (!invitation.success || !invitation.resultId) {
                        throw new Error(invitation.message);
                    }

                    const actionCodeSettings = {
                        url: `https://grupodiazalvarez.com/registro?email=${encodeURIComponent(email)}&invitationId=${invitation.resultId}`,
                        handleCodeInApp: true,
                    };

                    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

                    return `Invitación enviada a ${email}.`;
                })(),
                {
                    loading: "Enviando invitación, favor de esperar...",
                    success: (message) => message,
                    error: (error) => error.message || "Error al enviar la invitación.",
                }                               
            );         
        } catch (error: any) {
            toast.error("Error al enviar invitación", {
                description: error?.message || String(error),
            });
        } finally {
            setRole(RolUsuario.usuario);
            setEmpresaName("");
            setLoading(false);
            setUserEmail("");
            setEmpresaId("");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Agregar usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Ingresar nuevo usuario
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col w-full gap-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Correo electrónico"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            disabled={loading}
                            className="col-span-2"
                        />

                        <Popover open={openEmpresa} onOpenChange={setOpenEmpresa}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between truncate uppercase"
                                >
                                    {empresaName
                                        ? empresas.find((empresa) => empresa.nombre === empresaName)?.razonSocial
                                        : "Seleccione la empresa..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar empresa..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No se encontro la empresa.</CommandEmpty>
                                        <CommandGroup>
                                            {empresas.map((empresa) => (
                                                <CommandItem
                                                    key={empresa.id}
                                                    value={empresa.nombre}
                                                    onSelect={() => {
                                                        setEmpresaName(empresa.nombre)
                                                        setEmpresaId(empresa.id)
                                                        setOpenEmpresa(false)
                                                    }}
                                                    className="uppercase"
                                                >
                                                    {empresa.razonSocial || empresa.nombre}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            empresaName === empresa.nombre ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between truncate uppercase"
                                >
                                    {role
                                        ? ArrayRoles.find((rol) => rol.value === role)?.label
                                        : "Seleccione rol..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar rol..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No se encontro el rol.</CommandEmpty>
                                        <CommandGroup>
                                            {ArrayRoles.map((rol, index) => (
                                                <CommandItem
                                                    key={index}
                                                    value={rol.value}
                                                    onSelect={() => {
                                                        setRole(rol.value as RolUsuario)
                                                        setOpen(false)
                                                    }}
                                                    className="uppercase"
                                                >
                                                    {rol.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            role === rol.value as RolUsuario ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button
                        className="w-32"
                        onClick={() => generateNewUser(userEmail)}
                        disabled={loading}
                    >
                        <Link />
                        Enviar link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateUserDialog