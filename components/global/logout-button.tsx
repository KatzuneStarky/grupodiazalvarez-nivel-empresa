"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "../ui/button"
import Icon from "./icon"

export const LogoutButton = () => {
    const auth = useAuth()

    return (
        <Button variant={"destructive"} onClick={auth?.logout} className="cursor-pointer">
            <Icon iconName="mdi:logout" className="w-4" />
            Salir
        </Button>
    )
}