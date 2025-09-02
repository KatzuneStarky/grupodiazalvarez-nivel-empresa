"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArchivosForm from "./forms/archivos-form"
import Icon from "@/components/global/icon"
import { File } from "lucide-react"
import React from "react"

export const NewDocumentDialog = ({ eId, children }: { eId?: string, children: React.ReactNode }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Subir archivos de los equipos
                    </DialogTitle>
                    <DialogDescription>
                        Aqui podra subir los archivos de los equipos
                        y poder visualizarlos en la plataforma
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="archivos" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="archivos" className='flex items-center justify-center gap-1'>
                            <File size={20} />
                            Archivos
                        </TabsTrigger>
                        <TabsTrigger value="certificado" className='flex items-center justify-center gap-1'>
                            <Icon iconName='tabler:certificate' />
                            Certificado
                        </TabsTrigger>
                        <TabsTrigger value="archivos-vencimiento" className='flex items-center justify-center gap-1'>
                            <Icon iconName='icon-park-outline:file-date' />
                            Archivos Vencimiento
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="archivos" className='mt-4'>
                        <ArchivosForm equipoId={eId} fileCategory="archivos" />
                    </TabsContent>
                    <TabsContent value="certificado" className='mt-4'>
                        <ArchivosForm equipoId={eId} fileCategory="certificados" />
                    </TabsContent>
                    <TabsContent value="archivos-vencimiento" className='mt-4'>
                        <ArchivosForm equipoId={eId} fileCategory="archivosVencimiento" />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
