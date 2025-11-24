"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateMenuOrder, updateSubMenuOrder } from "@/modules/menus/actions/write";
import { Menu, SubMenu } from "@/modules/menus/types/menu-sistema";
import { Card, CardContent } from "@/components/ui/card";
import SorteableItem from "./menu/sorteable-item";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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

    const initializeMenus = (menuList: Menu[]) => {
        return [...menuList].sort((a, b) => a.order - b.order).map(menu => ({
            ...menu,
            subMenus: menu.subMenus ? [...menu.subMenus].sort((a, b) => a.order - b.order) : []
        }));
    };

    const areMenusContentEqual = (current: Menu[], incoming: Menu[]) => {
        if (current.length !== incoming.length) return false;

        const currentMap = new Map(current.map(m => [m.id, m]));

        for (const incomingMenu of incoming) {
            const currentMenu = currentMap.get(incomingMenu.id);
            if (!currentMenu) return false;

            const currentSubMenus = currentMenu.subMenus || [];
            const incomingSubMenus = incomingMenu.subMenus || [];

            if (currentSubMenus.length !== incomingSubMenus.length) return false;

            const currentSubMap = new Set(currentSubMenus.map(s => s.id));
            for (const sub of incomingSubMenus) {
                if (!currentSubMap.has(sub.id)) return false;
            }
        }

        return true;
    };

    useEffect(() => {
        if (menus && menus.length > 0) {
            setOrderedMenus((prev) => {
                if (prev.length === 0) {
                    return initializeMenus(menus);
                }

                if (areMenusContentEqual(prev, menus)) {
                    return prev;
                }

                return initializeMenus(menus);
            });
        }
    }, [menus]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const saveOrder = async () => {
        if (orderedMenus.length === 0) return;
        setIsSaving(true);

        try {
            const promises: Promise<any>[] = [];

            orderedMenus.forEach((menu, index) => {
                promises.push(updateMenuOrder(empresaId, areaId, menu.id, index + 1));

                if (menu.subMenus && menu.subMenus.length > 0) {
                    menu.subMenus.forEach((subMenu, subIndex) => {
                        promises.push(updateSubMenuOrder(empresaId, areaId, menu.id, subMenu.id, subIndex + 1));
                    });
                }
            });

            toast.promise(
                Promise.all(promises),
                {
                    loading: "Guardando orden...",
                    success: "Orden guardado con éxito",
                    error: "Error al guardar el orden",
                }
            );

            setOrderedMenus((prev) => prev.map((menu, index) => ({
                ...menu,
                order: index + 1,
                subMenus: menu.subMenus?.map((sub, subIndex) => ({ ...sub, order: subIndex + 1 }))
            })));

        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsSaving(false);
        }
    };

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setOrderedMenus((prev) => {
            const oldIndex = prev.findIndex((m) => m.id === String(active.id));
            const newIndex = prev.findIndex((m) => m.id === String(over.id));
            if (oldIndex === -1 || newIndex === -1) return prev;

            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleSubMenuReorder = (menuId: string, newSubMenus: SubMenu[]) => {
        setOrderedMenus(prev => prev.map(menu => {
            if (menu.id === menuId) {
                return { ...menu, subMenus: newSubMenus };
            }
            return menu;
        }));
    };

    return (
        <>
            <Table className="border rounded-lg">
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold w-10"></TableHead>
                        <TableHead className="font-semibold">Nombre</TableHead>
                        <TableHead className="font-semibold">Link</TableHead>
                        <TableHead className="font-semibold">Roles permitidos</TableHead>
                        <TableHead className="font-semibold">Orden</TableHead>
                        <TableHead className="font-semibold">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={orderedMenus.map((m) => m.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {orderedMenus.map((m) => (
                                <SorteableItem
                                    key={m.id}
                                    id={m.id}
                                    menu={m}
                                    areaId={areaId}
                                    empresaId={empresaId}
                                    empresaName={empresaName}
                                    onSubMenuReorder={handleSubMenuReorder}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </TableBody>
            </Table>
            <div className="flex justify-end my-4 mr-4">
                <Button onClick={saveOrder} disabled={isSaving} className="w-32">
                    {isSaving ? "Guardando..." : "Guardar Orden"}
                </Button>
            </div>
        </>
    )
}

export default MenuOrder