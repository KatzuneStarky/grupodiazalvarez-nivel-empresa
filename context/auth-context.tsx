"use client"

import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { toast } from "sonner"

type AuthContextType = {
    currentUser: User | null,
    logout: () => Promise<void>,
    loginWithGoogle: () => Promise<void>,
    registerWithEmail: (email: string, password: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user ?? null)
        })

        return () => unsubscribe()
    }, [currentUser])

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            toast.success("Inicio de sesión exitoso", {
                description: (
                    <div>
                        Has iniciado sesión correctamente.
                        <br />
                        Redirigiendo...
                    </div>
                ),
                duration: 5000,
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

    const registerWithEmail = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            toast.success("Registro exitoso", {
                description: "Tu cuenta ha sido creada. Redirigiendo...",
            });

            router.push("/usuario");
        } catch (error) {
            let message = "No se pudo registrar el usuario";
            if (error instanceof Error) message = error.message;

            toast.error("Error en registro", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Inicio de sesión exitoso", {
                description: "Bienvenido nuevamente.",
            });

            router.push("/usuario")
        } catch (error) {
            let message = "Credenciales incorrectas";
            if (error instanceof Error) message = error.message;

            toast.error("Error de autenticación", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (!currentUser?.uid) return;
            await auth.signOut()

            toast.success("Sesión cerrada", {
                description: "Has cerrado la sesión correctamente.",
            });
            router.push("/");
        } catch (error) {
            toast.error("No se pudo cerrar sesión", {
                description: `${error}`,
            });
        }
    }

    return (
        <AuthContext.Provider value={{
            currentUser,
            logout,
            loginWithGoogle,
            registerWithEmail,
            loginWithEmail,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext) 