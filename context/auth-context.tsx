"use client"

import { createUserWithEmailAndPassword, getIdTokenResult, GoogleAuthProvider, onAuthStateChanged, ParsedToken, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { RolUsuario } from "@/enum/user-roles"
import { FirebaseError } from "firebase/app"
import { SystemUser } from "@/types/usuario"
import { auth, db } from "@/firebase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type AuthContextType = {
    currentUser: User | null,
    logout: () => Promise<void>,
    loginWithGoogle: () => Promise<void>,
    registerWithEmail: (email: string, password: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    customClaims: ParsedToken | null
    lastSignInTime: string | null
    emailVerified: boolean
    rol: RolUsuario | null;
    refreshCustomClaims: () => void
    userBdd: SystemUser | null
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userBdd, setUserBdd] = useState<SystemUser | null>(null)
    const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null)
    const [lastSignInTime, setLastSignInTime] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emailVerified, setEmailVerified] = useState<boolean>(false)
    const [userRol, setUserRol] = useState<RolUsuario | null>(null);

    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setIsLoading(true);
            if (user) {
                setCurrentUser(user);
                setEmailVerified(user.emailVerified);

                try {
                    const tokenResult = await getIdTokenResult(user, true);
                    const claims = tokenResult.claims;

                    setCustomClaims(claims ?? null);
                    setUserRol(claims?.rol as RolUsuario ?? null);
                    setLastSignInTime(
                        user.metadata?.lastSignInTime || new Date().toISOString()
                    );
                } catch (error) {
                    console.error("Error al obtener custom claims:", error);
                }
            } else {
                setCurrentUser(null);
                setCustomClaims(null);
                setUserRol(null);
                setLastSignInTime(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUser) return
        const getUser = async () => {
            const userRef = doc(db, "usuarios", currentUser.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();

            setUserBdd(userData as SystemUser)
        }

        getUser()
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

    const refreshCustomClaims = async () => {
        if (!auth.currentUser) return;

        const tokenResult = await getIdTokenResult(auth.currentUser, true);
        const claims = tokenResult.claims;

        setCustomClaims(claims);
        setUserRol(claims?.rol as RolUsuario ?? null);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            logout,
            loginWithGoogle,
            registerWithEmail,
            loginWithEmail,
            customClaims,
            lastSignInTime,
            emailVerified,
            rol: userRol,
            refreshCustomClaims,
            userBdd,
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