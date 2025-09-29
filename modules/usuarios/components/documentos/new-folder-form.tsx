"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { NewFolderSchema, NewFolderSchemaType } from "../../schemas/new-folder.schema"
import { writeNewFolder } from "../../actions/documents/write"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Tag, TagInput } from 'emblor'
import { useState } from "react"
import { toast } from "sonner"


const NewFolderForm = ({
    className,
    button
}: {
    className?: string,
    button?: boolean
}) => {
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [tags, setTags] = useState<Tag[]>([]);
    const { currentUser } = useAuth()
    const router = useRouter()

    const form = useForm<NewFolderSchemaType>({
        resolver: zodResolver(NewFolderSchema),
        defaultValues: {
            name: "",
            ownerId: currentUser?.uid,
            description: "",
            tags: []
        }
    })

    const onSubmit = async (data: NewFolderSchemaType) => {
        console.log("Datos del formulario:", data);

        try {
            setIsSubmitting(true)

            toast.promise(writeNewFolder(
                data.name,
                currentUser?.uid || "",
                data.description || "",
                tags
            ), {
                loading: "Creando carpeta, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al crear la carpeta.";
                },
            })

            form.reset()
            router.refresh()
        } catch (error) {
            toast.error("Error al guardar el equipo")
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger className={className} asChild={button ? true : false}>
                {button === false ? (
                    <div>
                        <Icon iconName="material-symbols:create-new-folder-rounded" />
                        Nueva carpeta
                    </div>
                ) : (
                    <Button variant={"outline"}>
                        <Icon iconName="material-symbols:create-new-folder-rounded" />
                        Nueva carpeta
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon iconName="material-symbols:create-new-folder-rounded" />
                        Crear nueva carpeta
                    </DialogTitle>
                    <DialogDescription>
                        No olvide ingresar el nombre de la carpeta
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("Errores en el formulario:", errors);
                    })}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Importante!" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Descripcion</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Documentos importantes" className="h-32 resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start">
                                        <FormLabel className="text-left">Tags</FormLabel>
                                        <FormControl className="w-full">
                                            <TagInput
                                                {...field}
                                                placeholder="Ingrese un tag"
                                                tags={tags}
                                                className="h-10"
                                                setTags={(newTags) => {
                                                    setTags(newTags);
                                                    form.setValue('tags', newTags as [Tag, ...Tag[]]);
                                                }}
                                                activeTagIndex={activeTagIndex}
                                                setActiveTagIndex={setActiveTagIndex}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-5 tracking-wide font-semibold w-full"
                            disabled={isSubmitting}
                        >
                            <Icon iconName="material-symbols:create-new-folder-rounded" />
                            Crear carpeta
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default NewFolderForm