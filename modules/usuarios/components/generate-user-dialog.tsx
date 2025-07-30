"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { inviteNewUser } from "@/actions/invitaciones/write";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, UserPlus } from "lucide-react";
import { useState } from "react"
import { toast } from "sonner";
import { z } from "zod";

const newUserSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" })
})

const GenerateUserDialog = () => {
    const [userEmail, setUserEmail] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const auth = getAuth();

    const generateNewUser = async (email: string) => {
        const isValid = newUserSchema.safeParse({ email })

        if (!isValid.success) {
            toast.error("Email inválido");
            return;
        }

        setLoading(true)
        try {
            await sendSignInLinkToEmail(auth, email, {
                url: `https://grupodiazalvarez.com/registro?email=${email}`,
                handleCodeInApp: true,
            });

            toast.promise(
                inviteNewUser(email),
                {
                    loading: "Enviando invitación, favor de esperar...",
                    success: (result) => {
                        if (result.success) {
                            return `Invitación enviada a ${email}.`;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => error.message || "Error al enviar la invitación.",
                }
            );

            setUserEmail("");
        } catch (error: any) {
            toast.error("Error al enviar invitación", {
                description: error?.message || String(error),
            });
        } finally {
            setLoading(false);
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
                    <Input
                        placeholder="Correo electrónico"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        disabled={loading}
                    />

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