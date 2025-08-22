"use client"

import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import { Menu, SubMenu } from "@/modules/menus/types/menu-sistema";
import { TableCell, TableRow } from "@/components/ui/table";
import SortableSubmenuRow from "./sorteable-item-sub-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreateAreaMenuForm from "../menu-form";
import Icon from "@/components/global/icon";
import { useEffect, useState } from "react";
import SubMenuForm from "../sub-menu-form";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
    id: string;
    menu: Menu;
    areaId: string
    empresaId: string
    empresaName: string
}

const SorteableItem: React.FC<SortableItemProps> = ({ id, menu, areaId, empresaId, empresaName }) => {
    

    const [orderedSubMenus, setOrderedSubMenus] = useState<SubMenu[]>([]);
    const [expanded, setExpanded] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const subSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? "rgba(0,0,0,0.02)" : "transparent",
    };

    useEffect(() => {
        if (menu?.subMenus?.length) {
            setOrderedSubMenus([...menu.subMenus].sort((a, b) => a.order - b.order));
        } else {
            setOrderedSubMenus([]);
        }
    }, [menu]);

    const hasChildren = orderedSubMenus.length > 0;

    const handleSubDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setOrderedSubMenus((prev) => {
            const oldIndex = prev.findIndex((s) => s.id === String(active.id));
            const newIndex = prev.findIndex((s) => s.id === String(over.id));
            if (oldIndex === -1 || newIndex === -1) return prev;

            const next = arrayMove(prev, oldIndex, newIndex).map((s, i) => ({
                ...s,
                order: i + 1,
            }));
            return next;
        });
    };

    return (
        <>
            <TableRow
                ref={setNodeRef} style={style} {...attributes}
            >
                <TableCell
                    className="cursor-move place-items-center" {...listeners}
                >
                    <Icon iconName="mingcute:move-line" />
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        {hasChildren && (
                            <button
                                onClick={() => setExpanded((v) => !v)}
                                className="p-1 hover:bg-muted rounded"
                            >
                                {expanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </button>
                        )}
                        {!hasChildren && <div className="w-6" />}
                        <div className="flex items-center space-x-2">
                            <Icon iconName={menu.icon || ""} className="h-4 w-4" />
                            <span className="font-medium capitalize">{menu.title}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{menu.path}</code>
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {menu.rolesAllowed && menu.rolesAllowed.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs capitalize">
                                {role.replace("_", " ")}
                            </Badge>
                        ))}
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="text-xs">
                        {menu.order}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex space-x-1">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Crea un nuevo menu
                                    </DialogTitle>
                                    <DialogDescription>
                                        Agrega un nuevo link a tu área,
                                        ten en cuenta que se debe contactar
                                        al administrador para tener en cuenta los cambios.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateAreaMenuForm
                                    areaId={areaId}
                                    empresaName={empresaName}
                                    menuId={menu.id}
                                />
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    title="Add Submenu"
                                    className="h-8 w-8 p-0"
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Crea un nuevo submenu para {menu.title}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Agrega un nuevo submenu para el menu {menu.title} en tu area.
                                        Dicho submenu sera tomado como un nuevo modulo en el sistema
                                    </DialogDescription>
                                </DialogHeader>
                                <SubMenuForm menuId={menu.id} menuTitle={menu.title} />
                            </DialogContent>
                        </Dialog>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {hasChildren && expanded && (
                <DndContext
                    sensors={subSensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleSubDragEnd}
                >
                    <SortableContext
                        items={orderedSubMenus.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {orderedSubMenus.map((submenu) => (
                            <SortableSubmenuRow
                                key={submenu.id}
                                submenu={submenu}
                                parentOrder={menu.order}
                                areaId={areaId}
                                empresaId={empresaId}
                                empresaName={empresaName}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </>
    )
}

export default SorteableItem