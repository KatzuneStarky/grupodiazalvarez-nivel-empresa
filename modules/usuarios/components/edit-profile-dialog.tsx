"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit3 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { updateUserProfile } from "../actions/update-profile"
import { useRouter } from "next/navigation"

const EditProfileSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
})

type EditProfileSchemaType = z.infer<typeof EditProfileSchema>

interface EditProfileDialogProps {
    currentUser: { uid: string } | null
    userBdd: { nombre?: string } | null
    trigger?: React.ReactNode
}

export const EditProfileDialog = ({ currentUser, userBdd, trigger }: EditProfileDialogProps) => {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<EditProfileSchemaType>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            nombre: userBdd?.nombre || "",
        },
    })

    const onSubmit = async (data: EditProfileSchemaType) => {
        if (!currentUser?.uid) return

        try {
            setIsSubmitting(true)
            const result = await updateUserProfile(currentUser.uid, data)

            if (result.success) {
                toast.success("Perfil actualizado correctamente")
                setOpen(false)
                router.refresh()
            } else {
                throw new Error("Error al actualizar el perfil")
            }
        } catch (error) {
            toast.error("Error al actualizar el perfil")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg font-semibold px-6">
                        <Edit3 className="h-5 w-5 mr-2" />
                        Editar Perfil
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>
                        Actualiza tu información personal aquí.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tu nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
