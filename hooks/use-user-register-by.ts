"use client"

import { TipoRegistroUsuario } from "@/modules/auth/enum/tipo-registro-usuario"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"

export const useUserRegisterBy = () => {
    const auth = useAuth()

    const [isRegisterByGoogle, setIsRegisterByGoogle] = useState<TipoRegistroUsuario>(TipoRegistroUsuario.google)
    const [isRegisterByEmail, setIsRegisterByEmail] = useState<TipoRegistroUsuario>(TipoRegistroUsuario.email)
    const [registerProvider, setRegisterProvider] = useState<string>("")

    useEffect(() => {
        //auth?.currentUser?.providerData[0].providerId <-- Tipo de registro del usuario (google, email, etc...)
        setRegisterProvider(auth?.currentUser?.providerData[0].providerId ?? "")

        if(registerProvider === "google.com") setIsRegisterByGoogle(TipoRegistroUsuario.google as TipoRegistroUsuario)
        if(registerProvider === "email") setIsRegisterByEmail(TipoRegistroUsuario.email as TipoRegistroUsuario)
    }, [auth, registerProvider])

    return { isRegisterByGoogle, isRegisterByEmail, registerProvider }

}

export default useUserRegisterBy