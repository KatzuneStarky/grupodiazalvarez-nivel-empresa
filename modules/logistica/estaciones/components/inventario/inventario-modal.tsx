"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateInventarioEstacion } from "../../actions/inventario/write";
import { InventarioEstaciones } from "../../types/inventarios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InventarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: InventarioEstaciones | null;
    selectedDInventariado: 'inventarioMagna' | 'inventarioPremium' | 'inventarioDiesel';
}

const numberFields: (keyof InventarioEstaciones)[] = [
    "inventarioMagna",
    "pVentasDiarias",
    "dInventariados1",
    "inventarioPremium",
    "pVentasDiarias2",
    "dInventariados2",
    "inventarioDiesel",
    "pVentasDiarias3",
    "dInventariados3",
];

const InventarioModal = ({
    data,
    isOpen,
    onClose,
    selectedDInventariado
}: InventarioModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<InventarioEstaciones>({
        estacion: '',
        inventarioMagna: 0,
        pVentasDiarias: 0,
        dInventariados1: 0,
        inventarioPremium: 0,
        pVentasDiarias2: 0,
        dInventariados2: 0,
        inventarioDiesel: 0,
        pVentasDiarias3: 0,
        dInventariados3: 0,
    });

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: numberFields.includes(name as keyof InventarioEstaciones)
                ? parseFloat(value) || 0
                : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData) return;

            setIsSubmitting(true);

            const updatedData: InventarioEstaciones = {
                ...formData,
                dInventariados1: formData.pVentasDiarias ? formData.inventarioMagna / formData.pVentasDiarias : 0,
                dInventariados2: formData.pVentasDiarias2 ? formData.inventarioPremium / formData.pVentasDiarias2 : 0,
                dInventariados3: formData.pVentasDiarias3 ? formData.inventarioDiesel / formData.pVentasDiarias3 : 0,
            };

            toast.promise(updateInventarioEstacion(updatedData), {
                loading: "Actualizando inventario...",
                success: () => {
                    onClose();
                    return "Inventario actualizado correctamente";
                },
                error: "Error al actualizar el inventario",
            });
        } catch (error) {
            console.error("Error actualizando el inventario:", error);
            toast.error("Error al actualizar el inventario");
        } finally {
            setIsSubmitting(false);
        }
    };

    const colorsMap = {
        inventarioMagna: "rgb(0,165,81)",
        inventarioPremium: "rgb(213,43,30)",
        inventarioDiesel: "rgb(55,55,53)",
    } as const;

    const colorType = `text-[${colorsMap[selectedDInventariado]}]`;
    const bgType = `bg-[${colorsMap[selectedDInventariado]}]`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xs">
                <DialogHeader>
                    <DialogTitle className={`${colorType}`}>
                        Actualizar Inventario{" "}
                        {
                            selectedDInventariado === "inventarioMagna"
                                ? "Magna" :
                                selectedDInventariado === "inventarioPremium"
                                    ? "Premium" : "Diesel"
                        }
                    </DialogTitle>
                </DialogHeader>

                <div>
                    <Input
                        name={selectedDInventariado}
                        placeholder={`Nuevo valor para ${selectedDInventariado}`}
                        type="number"
                        value={formData[selectedDInventariado] || ''}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />

                    <div className="flex items-center w-full gap-4 mt-4">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className={`${bgType}`}>Actualizar Inventario</Button>
                        <Button onClick={onClose} disabled={isSubmitting} className="w-fit px-4">Cerrar</Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default InventarioModal