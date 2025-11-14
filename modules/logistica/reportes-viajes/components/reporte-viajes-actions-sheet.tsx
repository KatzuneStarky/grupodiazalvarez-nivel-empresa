"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const ReporteViajesActionsSheet = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Zap />
                    Acciones
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default ReporteViajesActionsSheet