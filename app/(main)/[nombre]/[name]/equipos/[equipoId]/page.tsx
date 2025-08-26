"use client"

import EquipoIdTanqueCard from '@/modules/logistica/equipos/components/equipoId/equipo-id-tanque-card';
import EquipoIdCard from '@/modules/logistica/equipos/components/equipoId/equipo-id-card';
import useEquipoDataById from '@/modules/logistica/equipos/hooks/use-equipos-data-by-id';
import { esArchivoVencimiento, esCertificado } from '@/functions/tipo-archivo-equipo';
import { Button } from '@/components/ui/button';
import Icon from '@/components/global/icon';
import React, { use, useState } from 'react'
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = "all" | "archivos" | "certificados" | "archivosVencimiento";

const EquipoIdPage = ({ params }: { params: Promise<{ equipoId: string }> }) => {
    const [filter, setFilter] = useState<FilterType>("all");
    const { equipoId } = use(params);

    const {
        archivosVencimiento,
        certificados,
        archivos,
        loading,
        equipo,
        error
    } = useEquipoDataById(equipoId)

    const combinedArray = [...archivos, ...certificados, ...archivosVencimiento];

    const filteredFiles = combinedArray.filter((file) => {
        if (filter === "all") return true;
        if (filter === "archivos") return "updateAt" in file;
        if (filter === "certificados") return esCertificado(file);
        if (filter === "archivosVencimiento") return esArchivoVencimiento(file);
        return false;
    });

    const getFilterButtonClass = (filterType: FilterType) => {
        const baseClasses = "px-4 py-2 rounded-md transition-colors duration-200";
        const activeClasses = "bg-emerald-500 text-white hover:bg-emerald-700";
        const inactiveClasses = "bg-black text-white hover:bg-emerald-700";

        return filter === filterType
            ? `${baseClasses} ${activeClasses}`
            : `${baseClasses} ${inactiveClasses}`;
    };

    return (
        <div className='container mx-auto space-y-4 my-4'>
            <div className="grid grid-cols-2 gap-4 w-full">
                <EquipoIdCard equipo={equipo} />
                <div className="space-y-2">
                    {equipo?.tanques && equipo.tanques.map((t) => (
                        <EquipoIdTanqueCard tanque={t} key={t.id} />
                    ))}
                </div>
            </div>
            <div className="py-12 space-y-6 w-full">
                <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => setFilter("all")}
                            className={cn("flex items-center gap-2", getFilterButtonClass("all"))}
                            size={"lg"}
                        >
                            <Icon iconName="ph:files-bold" />
                            Todos ({combinedArray.length})
                        </Button>
                        <Button
                            onClick={() => setFilter("archivos")}
                            className={cn("flex items-center gap-2", getFilterButtonClass("archivos"))}
                            size={"lg"}
                        >
                            <File size={20} />
                            Archivos ({archivos.length})
                        </Button>
                        <Button
                            onClick={() => setFilter("archivosVencimiento")}
                            className={cn("flex items-center gap-2", getFilterButtonClass("archivosVencimiento"))}
                            size={"lg"}
                        >
                            <Icon iconName='icon-park-outline:file-date' />
                            Archivos Vencimiento ({archivosVencimiento.length})
                        </Button>
                        <Button
                            onClick={() => setFilter("certificados")}
                            className={cn("flex items-center gap-2", getFilterButtonClass("certificados"))}
                            size={"lg"}
                        >
                            <Icon iconName='tabler:certificate' />
                            Certificados ({certificados.length})
                        </Button>
                    </div>
                    <div className="flex space-x-2">
                        {/** <CreateNewFile eId={equipoId} /> */}
                        test
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredFiles.length === 0 ? (<p>No hay archivos para mostrar.</p>)
                            : (filteredFiles.map((file) => (<>{/** <DocumentoCard file={file} key={file.id} /> */}</>)))}
                    </div>
                </div>

                <div className="lg:w-1/3 space-y-6">
                    {/** <ArchivosChart2 equipoId={equipoId} /> */}
                </div>
            </div>
        </div>
    )
}

export default EquipoIdPage