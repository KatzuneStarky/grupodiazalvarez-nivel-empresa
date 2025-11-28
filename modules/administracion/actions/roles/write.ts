import { RolesUsuario } from "@/types/roles-usuario";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v7 as uuidV7 } from "uuid";

type permission = {
    crear: boolean
    leer: boolean
    actualizar: boolean
    eliminar: boolean
    aprobar: boolean
    exportar: boolean
}

export const writeRoles = async (data: Omit<RolesUsuario, "id">):
    Promise<{ success: boolean; message: string; data?: RolesUsuario; error?: Error }> => {
    try {
        const id = uuidV7();

        if (!data.name || !data.type || !data.permisos) {
            return {
                success: false,
                message: "Faltan datos para escribir el rol"
            }
        }

        const rolesRef = doc(db, "roles_usuario", id)
        await setDoc(rolesRef, {
            id,
            ...data
        })

        return {
            success: true,
            message: "Rol creado exitosamente",
            data: {
                id,
                ...data
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Error al escribir el rol",
            error: error as Error
        }
    }
}

export const updateRolPermission
    = async (id: string, permission: permission)
        : Promise<{ success: boolean; message: string; error?: Error }> => {
        try {
            const rolesRef = doc(db, "roles_usuario", id)
            await updateDoc(rolesRef, {
                permisos: permission
            })

            return {
                success: true,
                message: "Permisos actualizados exitosamente"
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Error al actualizar los permisos",
                error: error as Error
            }
        }
    }