"use client"

import { convertirFecha, convertirFechaVencimiento } from "@/functions/document-date";
import { esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { estadoMap, getEstadoArchivo } from "../../constants/estado-map";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { FileVariant } from "../document-card";
import Icon from "@/components/global/icon"
import { format } from "date-fns";

const HeaderToolTip = ({ file }: { file: FileVariant }) => {
    const { estado, iconName } = getEstadoArchivo(file);
    const { icon, bg, texto } = estadoMap[estado];

    return (
        <div>
            {esCertificado(file) && (
                <Tooltip>
                    <TooltipTrigger>
                        <Icon
                            iconName={iconName}
                            className={`mx-auto size-12 ${icon}`}
                        />
                    </TooltipTrigger>
                    <TooltipContent className={bg}>
                        {texto} {format(parseFirebaseDate(file.fecha), "dd/MM/yyyy")} -{" "}
                        {format(convertirFecha(file.fecha), "dd/MM/yyyy")}
                    </TooltipContent>
                </Tooltip>
            )}

            {esArchivoVencimiento(file) && (
                <Tooltip>
                    <TooltipTrigger>
                        <Icon
                            iconName={iconName}
                            className={`mx-auto size-12 ${icon}`}
                        />
                    </TooltipTrigger>
                    <TooltipContent className={bg}>
                        {texto} {format(parseFirebaseDate(file.fecha), "dd/MM/yyyy")} -{" "}
                        {format(convertirFechaVencimiento(file), "dd/MM/yyyy")}
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    )
}

export default HeaderToolTip