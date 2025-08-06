"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateMenuOrder } from "@/modules/menus/actions/write";
import { Menu } from "@/modules/menus/types/menu-sistema";
import { Card, CardContent } from "@/components/ui/card";
import SorteableItem from "./menu/sorteable-item";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface MenuOrderProps {
    areaId: string;
    empresaId: string
    empresaName: string,
    menus: Menu[],
    loading: boolean,
    error: Error | null
}

const MenuOrder: React.FC<MenuOrderProps> = ({ areaId, empresaId, empresaName, menus, loading, error }) => {
    const [orderedMenus, setOrderedMenus] = useState<Menu[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (menus && menus.length > 0) {
            const sorted = [...menus].sort((a, b) => a.order - b.order);
            setOrderedMenus(sorted);
        }
    }, [menus]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const saveOrder = async () => {
        if (orderedMenus.length === 0) return;
        setIsSaving(true);

        try {
            toast.promise(
                Promise.all(
                    orderedMenus.map((menu, index) =>
                        updateMenuOrder(empresaId, areaId, menu.id, index + 1)
                    )
                ),
                {
                    loading: "Guardando orden...",
                    success: "Orden guardado con éxito",
                    error: "Error al guardar el orden",
                }
            );

            setOrderedMenus(
                orderedMenus.map((menu, index) => ({
                    ...menu,
                    order: index + 1,
                }))
            );
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const debouncedSaveOrder = debounce(saveOrder, 800)

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setOrderedMenus((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)
                const newOrder = arrayMove(items, oldIndex, newIndex)
                //debouncedSaveOrder()

                return newOrder
            })
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Cargando menus...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }
    if (error) return <div className="text-red-500">Error al cargar los menús</div>

    return (
        <div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={orderedMenus}
                    strategy={verticalListSortingStrategy}
                >
                    <Table className="border rounded-lg">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold"></TableHead>
                                <TableHead className="font-semibold">Nombre</TableHead>
                                <TableHead className="font-semibold">Link</TableHead>
                                <TableHead className="font-semibold">Roles permitidos</TableHead>
                                <TableHead className="font-semibold">Orden</TableHead>
                                <TableHead className="font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderedMenus.map((menu) => (
                                <SorteableItem
                                    key={menu.id}
                                    id={menu.id}
                                    menu={menu}
                                    areaId={areaId}
                                    empresaId={empresaId}
                                    empresaName={empresaName}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </SortableContext>
            </DndContext>
            <div className="flex justify-end my-4 mr-4">
                <Button onClick={saveOrder} disabled={isSaving} className="w-32">
                    {isSaving ? "Guardando..." : "Guardar Orden"}
                </Button>
            </div>
        </div>
    )
}

export default MenuOrder