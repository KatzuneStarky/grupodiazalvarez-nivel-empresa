"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { MultiFactorResolver } from "firebase/auth"
import { useTwoFactor } from "../hooks/use-two-factor"

const CodeSchema = z.object({
    code: z.string().length(6, "El código debe tener 6 dígitos")
})

interface TwoFactorVerificationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    resolver: MultiFactorResolver | null
    onSuccess?: () => void
}

export const TwoFactorVerificationDialog = ({
    open,
    onOpenChange,
    resolver,
    onSuccess
}: TwoFactorVerificationDialogProps) => {
    const [isVerifying, setIsVerifying] = useState(false)
    const { verifySecondFactor } = useTwoFactor()

    const form = useForm<z.infer<typeof CodeSchema>>({
        resolver: zodResolver(CodeSchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof CodeSchema>) => {
        if (!resolver) return

        setIsVerifying(true)
        const result = await verifySecondFactor(resolver, data.code)
        setIsVerifying(false)

        if (result.success) {
            onOpenChange(false)
            onSuccess?.()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        Verificación de Dos Factores
                    </DialogTitle>
                    <DialogDescription>
                        Ingresa el código de 6 dígitos enviado a tu teléfono
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código de Verificación</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456"
                                            maxLength={6}
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isVerifying}
                        >
                            {isVerifying ? "Verificando..." : "Verificar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
