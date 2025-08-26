"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tanque } from "@/modules/logistica/bdd/equipos/types/tanque"
import { Timestamp } from "firebase/firestore";
import { es } from "date-fns/locale";
import { format } from "date-fns";

const EquipoIdTanqueCard = ({ tanque }: { tanque: Tanque | null }) => {
    const createAtDate
        = tanque?.createdAt instanceof Timestamp
            ? tanque?.createdAt.toDate()
            : new Date(tanque?.createdAt || new Date());
    const updateAtDate
        = tanque?.updatedAt instanceof Timestamp
            ? tanque?.updatedAt.toDate()
            : new Date(tanque?.updatedAt || new Date());

    return (
        <Card className="w-full h-fit flex flex-col">
            <div className="w-full h-48 overflow-hidden p-2">
                <img
                    src={"https://cdn.milenio.com/uploads/media/2024/01/23/autotanques-de-combustibles-foto-especial.jpeg"}
                    alt={`${tanque?.marca} ${tanque?.modelo}`}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {tanque?.marca} {tanque?.modelo}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Año</p>
                        <p className="font-semibold">{tanque?.year}</p>
                    </div>

                    {tanque?.serie && (
                        <div>
                            <p className="text-sm text-muted-foreground">Serie</p>
                            <p className="font-semibold">{tanque?.serie}</p>
                        </div>
                    )}

                    {tanque?.placas && (
                        <div>
                            <p className="text-sm text-muted-foreground">Placas</p>
                            <p className="font-semibold">{tanque?.placas}</p>
                        </div>
                    )}
                </div>

                <div className="border-t pt-4 text-sm text-muted-foreground">
                    <p>Creado: {format(createAtDate, "PPP", { locale: es })}</p>
                    <p>Actualizado: {format(updateAtDate, "PPP", { locale: es })}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default EquipoIdTanqueCard