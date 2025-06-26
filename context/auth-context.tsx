"use client"

import { createUserWithEmailAndPassword, GoogleAuthProvider, ParsedToken, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { removeToken, setToken } from "@/modules/auth/actions/token"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { toast } from "sonner"
import { FirebaseError } from "firebase/app"

type AuthContextType = {
    currentUser: User | null,
    logout: () => Promise<void>,
    loginWithGoogle: () => Promise<void>,
    registerWithEmail: (email: string, password: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    customClaims: ParsedToken | null
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user ?? null)
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const refreshToken = user.refreshToken;

                    const res = await fetch("/api/auth/validate", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const claims = data.claims;

                        setCustomClaims(claims ?? null);

                        if (token && refreshToken) {
                            await setToken({ token, refreshToken });
                        }
                    } else {
                        await removeToken();
                        await auth.signOut();
                    }
                } catch (error) {
                    console.error("Error al validar token:", error);
                    await removeToken();
                    await auth.signOut();
                }
            } else {
                await removeToken();
            }
        })

        return () => unsubscribe()
    }, [])

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
            let message
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/wrong-password":
                        message = "Contraseña incorrecta.";
                        break;
                    case "auth/user-not-found":
                        message = "No existe una cuenta con ese correo.";
                        break;
                    case "auth/too-many-requests":
                        message = "Demasiados intentos. Intenta más tarde.";
                        break;
                    default:
                        message = error.message;
                }
            }
            toast.error("Error", {
                description: message
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
            customClaims,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}