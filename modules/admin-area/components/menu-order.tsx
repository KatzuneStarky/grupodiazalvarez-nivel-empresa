"use client"

import { Button } from "@/components/ui/button";
import { useArea } from "@/context/area-context";
import { Menu } from "@/modules/menus/types/menu-sistema";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import SorteableItem from "./menu/sorteable-item";
import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area";

interface MenuOrderProps {
    areaId: string;
}

const MenuOrder: React.FC<MenuOrderProps> = ({ areaId }) => {
    const [orderedMenus, setOrderedMenus] = useState<Menu[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const { menus, loading, error } = useMenusByArea(areaId);

    useEffect(() => {
        if (menus) {
            setOrderedMenus(menus.sort((a, b) => a.order - b.order));
        }
    }, [menus]);

    useEffect(() => {
        if (menus) {
            setOrderedMenus(menus);
        }
    }, [menus]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setOrderedMenus((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const saveOrder = async () => {
        setIsSaving(true);
        try {
            {/**
                await Promise.all(
                orderedMenus.map((menu, index) => updateMenuOrder(areaId, menu.id, index + 1))
            ); */}
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar los menús</div>;

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
                    <div className="grid grid-cols-7 gap-4 p-2 bg-gray-100 dark:bg-gray-800">
                        <div></div>
                        <div>ID</div>
                        <div>Orden</div>
                        <div>Nombre</div>
                        <div>Icono</div>
                        <div>Link</div>
                        <div>Acciones</div>
                    </div>

                    {orderedMenus.map((menu) => (
                        <SorteableItem key={menu.id} id={menu.id} menu={menu} />
                    ))}
                </SortableContext>
            </DndContext>
            <Button onClick={saveOrder} disabled={isSaving} className="mt-4 w-32">
                {isSaving ? "Guardando..." : "Guardar Orden"}
            </Button>
        </div>
    )
}

export default MenuOrder