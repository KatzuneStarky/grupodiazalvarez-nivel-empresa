"use client"

import { EquipoConMantenimientos } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos";
import { estadoColores } from "../../constants/colores-estado";
import { getUltimoMantenimiento } from "../../actions/read";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Timestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { es } from "date-fns/locale";
import { format } from "date-fns";

const EquipoIdCard = ({ equipo }: { equipo: EquipoConMantenimientos | null }) => {
    const ultimoMantenimiento = getUltimoMantenimiento({
        equipoId: equipo?.id || "",
    }, equipo?.mantenimientos);

    const createAtDate
        = equipo?.createdAt instanceof Timestamp
            ? equipo?.createdAt.toDate()
            : new Date(equipo?.createdAt || new Date());
    const updateAtDate
        = equipo?.updatedAt instanceof Timestamp
            ? equipo?.updatedAt.toDate()
            : new Date(equipo?.updatedAt || new Date());

    return (
        <Card className="w-full overflow-hidden flex flex-col">
            <div className="w-full overflow-hidden p-2">
                <img
                    src={equipo?.imagen ? equipo.imagen : `https://images.unsplash.com/photo-1601584115197-04ecc0da31d7`}
                    alt={`${equipo?.marca} ${equipo?.modelo}`}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            <div className="p-6 space-y-4 flex-grow">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {equipo?.marca} {equipo?.modelo}
                    </h2>
                    <Badge
                        className={`capitalize`}
                        style={{ backgroundColor: estadoColores[equipo?.estado as EstadoEquipos] }}
                    >
                        {equipo?.estado}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-600">Número Económico:</span>
                        <p>{equipo?.numEconomico}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600">Año:</span>
                        <p>{equipo?.year}</p>
                    </div>
                    {equipo?.serie && (
                        <div>
                            <span className="font-medium text-gray-600">Serie:</span>
                            <p>{equipo?.serie}</p>
                        </div>
                    )}
                    {equipo?.placas && (
                        <div>
                            <span className="font-medium text-gray-600">Placas:</span>
                            <p>{equipo?.placas}</p>
                        </div>
                    )}
                    {equipo?.m3 && (
                        <div>
                            <span className="font-medium text-gray-600">M³:</span>
                            <p>{equipo?.m3} M³</p>
                        </div>
                    )}
                    {equipo?.tipoTanque && (
                        <div>
                            <span className="font-medium text-gray-600">Tipo Tanque:</span>
                            <p>{equipo?.tipoTanque}</p>
                        </div>
                    )}
                </div>

                <Separator />

                {ultimoMantenimiento ? (
                    <div className=''>
                        {/** <UltimoMantenimientoCard mantenimiento={ultimoMantenimiento} /> */}
                    </div>
                ) : (
                    <Card className='p-4'>
                        El equipo {equipo?.numEconomico} no cuenta con un mantenimiento en las ultimas fechas
                    </Card>
                )}

                <div className="flex justify-between items-center border-t pt-4">
                    <div>
                        <p className="text-xs text-gray-500 capitalize">
                            Creado: {format(createAtDate, 'PPP', { locale: es })}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                            Actualizado: {format(updateAtDate, 'PPP', { locale: es })}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Activo</span>
                        <Switch
                            checked={equipo?.activo}
                            onCheckedChange={() => { }}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default EquipoIdCard