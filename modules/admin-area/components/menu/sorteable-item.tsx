"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Menu, SubMenu } from "@/modules/menus/types/menu-sistema";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import CreateAreaMenuForm from "../menu-form";
import Icon from "@/components/global/icon";
import SubMenuForm from "../sub-menu-form";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

interface SortableItemProps {
    id: string;
    menu: Menu;
    areaId: string
    empresaId: string
    empresaName: string
}

const SorteableItem: React.FC<SortableItemProps> = ({ id, menu, areaId, empresaId, empresaName }) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const [orderedSubMenus, setOrderedSubMenus] = useState<SubMenu[]>([]);
    const [level, setLevel] = useState<number>(0)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const toggleExpanded = (itemId: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(itemId)) {
                newSet.delete(itemId)
            } else {
                newSet.add(itemId)
            }
            return newSet
        })
    }

    useEffect(() => {
        if (menu) {
            const sorted = [...menu.subMenus?.filter((subMenu) => subMenu.order !== null) || []].sort((a, b) => a.order - b.order);
            setOrderedSubMenus(sorted);
        }
    }, [menu]);

    const hasChildren = menu.subMenus && menu.subMenus.length > 0
    const isExpanded = expandedItems.has(menu.id)

    useEffect(() => {
        if (hasChildren && isExpanded && (menu.subMenus && menu.subMenus?.length > 0)) {
            setLevel(level + 1)
        } else {
            setLevel(0)
        }
    }, [isExpanded, hasChildren, menu.subMenus])


    return (
        <>
            <TableRow
                ref={setNodeRef}
                style={style}
            >
                <TableCell
                    className="cursor-move place-items-center bg-red-900"
                    {...attributes}
                    {...listeners}
                >
                    <Icon iconName="mingcute:move-line" />
                </TableCell>

                <TableCell>
                    <div className="flex items-center space-x-2">
                        {hasChildren && (
                            <button onClick={() => toggleExpanded(menu.id)} className="p-1 hover:bg-muted rounded">
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                        )}
                        {!hasChildren && <div className="w-6" />}
                        <div className="flex items-center space-x-2">
                            <Icon iconName={menu.icon || ""} className="h-4 w-4" />
                            <span className="font-medium capitalize">{menu.title}</span>
                            {level && level > 0 ? (
                                <Badge variant="outline" className="text-xs">
                                    Submenu
                                </Badge>
                            ) : null}
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
            {hasChildren && isExpanded && orderedSubMenus?.map((submenu) => (
                <TableRow
                    ref={setNodeRef}
                    style={style}
                    className={level && level > 0 ? "bg-muted/30" : "hover:bg-muted/50"}
                    key={submenu.id}
                >
                    <TableCell
                        className="cursor-move place-items-center bg-orange-800"
                        {...attributes}
                        {...listeners}
                    >
                        <Icon iconName="mingcute:move-line" />
                    </TableCell>
                    <TableCell style={{ paddingLeft: `4rem` }}>
                        <div className="flex items-center space-x-2">
                            <Icon iconName={submenu.icon || ""} className="h-4 w-4" />
                            <span className="font-medium capitalize">{submenu.title}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <code className="text-sm bg-muted-foreground/50 px-2 py-1 rounded font-mono">{submenu.path}</code>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">

                            {submenu.rolesAllowed && submenu.rolesAllowed.slice(0, 2).map((role) => (
                                <Badge key={role} variant="default" className="text-xs capitalize">
                                    {role.replace("_", " ")}
                                </Badge>
                            ))}

                            {submenu.rolesAllowed && submenu.rolesAllowed.length > 2 && (
                                <Badge>
                                    +{submenu.rolesAllowed.length - 2}
                                </Badge>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="default" className="text-xs">
                            {menu.order}.{submenu.order}
                        </Badge>
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                        <div className="flex space-x-1">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="default"
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
                            <Button
                                size="sm"
                                variant="default"
                                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

export default SorteableItem