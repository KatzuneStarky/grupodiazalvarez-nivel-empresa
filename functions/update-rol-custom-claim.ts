import { RolUsuario } from "@/enum/user-roles";

export const updateRolCustomClaim = async (uid: string, rol: RolUsuario): Promise<{ response: string, error: string }> => {
    const response = await fetch("/api/auth/updateCustomClaims", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uid: uid,
            rol: rol,
        }),
    });

    if (response.ok) {
        return { response: "Custom claims updated successfully.", error: "" };
    } else {
        return { response: "", error: "No se pudieron establecer los custom claims." };
    }
};