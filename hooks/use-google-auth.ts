"use client"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useState } from "react";
import { toast } from "sonner";

export const useGoogleLogin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            toast.success("Inicio de sesión exitoso", {
                description: "Has iniciado sesión correctamente.",
            });
        } catch (error) {
            let errorMessage = "No se pudo iniciar sesión con Google";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error("Error", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, isLoading };
};