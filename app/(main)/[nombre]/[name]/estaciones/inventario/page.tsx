"use client"

import InventariosEstacionesForm from '@/modules/logistica/estaciones/components/inventario/inventarios-estaciones-form';
import { useInventarioEstaciones } from '@/modules/logistica/estaciones/hooks/use-inventarios-estaciones';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InventoryTabContent from '@/modules/logistica/estaciones/components/inventario/tab-content';
import { ORDEN_ESTACIONES } from '@/modules/logistica/estaciones/constants/estaciones-ordenadas';
import { InventarioEstaciones } from '@/modules/logistica/estaciones/types/inventarios';
import { Separator } from '@/components/ui/separator';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import Icon from '@/components/global/icon';
import { useMemo, useRef } from "react";
import { toast } from 'sonner';

const InventariosEstacionesPage = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const { data } = useInventarioEstaciones();

    const ordenarInventario = (inventario: InventarioEstaciones[], orden: string[]) =>
        [...inventario].sort((a, b) => {
            const indexA = orden.indexOf(a.estacion);
            const indexB = orden.indexOf(b.estacion);
            return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
        });

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Inventarios_Estaciones_${new Date().toLocaleDateString()}`,
        onBeforePrint: async () => {
            toast.info('Preparando impresión...');
            return Promise.resolve();
        },
        onAfterPrint: () => toast.success("Impresión completada."),
    });

    const estacionesOrdenadas = useMemo(
        () => ordenarInventario(data, ORDEN_ESTACIONES),
        [data]
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon iconName='material-symbols:inventory' className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Inventarios de Estaciones de Servicio</h1>
                        <p className="text-muted-foreground">
                            Gestión de los inventarios de las estaciones de servicio
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-6'>
                    <Button
                        onClick={() => handlePrint()}
                        variant={"outline"}
                        className="px-4 py-2 rounded"
                    >
                        <Icon iconName='material-symbols:print-outline-rounded' />
                        Imprimir inventario
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName='mingcute:inventory-line' />
                                Crear inventario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                            <DialogHeader>
                                <DialogTitle>
                                    Crear un nuevo inventario de estacion
                                </DialogTitle>
                            </DialogHeader>
                            <InventariosEstacionesForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Separator className='my-4' />
            <InventoryTabContent
                estacionesOrdenadas={estacionesOrdenadas}
                componentRef={componentRef}
            />
        </div>
    )
}

export default InventariosEstacionesPage