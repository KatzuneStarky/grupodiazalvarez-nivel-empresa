"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
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

    const actionCodeSettings = {
        url: `https://grupodiazalvarez.com/entrar?email=${userEmail}`,
        handleCodeInApp: true
    };

    const generateNewUser = (email: string) => {
        const isValid = newUserSchema.safeParse({
            email
        })
        if (isValid.success) {
            sendSignInLinkToEmail(auth, email, actionCodeSettings)
                .then(() => {
                    setLoading(true)
                    window.localStorage.setItem('emailForSignIn', email);
                    toast.success("Link de invitación enviado")

                    setUserEmail("")
                })
                .catch((error) => {
                    setLoading(false)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorCode, {
                        description: errorMessage
                    })

                    setUserEmail("")
                }).finally(() => {
                    setLoading(false)
                    setUserEmail("")
                });
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