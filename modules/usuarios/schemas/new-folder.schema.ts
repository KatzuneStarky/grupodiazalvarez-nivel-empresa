import { z } from "zod";

export const NewFolderSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    ownerId: z.string(),
    description: z.string(),
    tags: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
        }),
    )
})

export type NewFolderSchemaType = z.infer<typeof NewFolderSchema>