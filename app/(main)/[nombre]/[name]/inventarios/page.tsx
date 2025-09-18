"use client"

import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import Icon from '@/components/global/icon';
import { toast } from 'sonner';
import { useRef } from "react";

const InventoriesPage = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Inventariados',
        onBeforePrint: async () => {
            toast.info('Preparando impresión...');
            return Promise.resolve();
        },
        onAfterPrint: () => {
            toast.success('Impresión completada.');
        },
    });

    return (
        <div>

        </div>
    )
}

export default InventoriesPage