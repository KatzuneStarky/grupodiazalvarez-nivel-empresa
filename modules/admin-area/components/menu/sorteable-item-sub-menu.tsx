"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubMenu } from "@/modules/menus/types/menu-sistema";
import { TableCell, TableRow } from "@/components/ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Icon from "@/components/global/icon";
import SubMenuForm from "../sub-menu-form";
import { CSS } from "@dnd-kit/utilities";

const SortableSubmenuRow: React.FC<{
    submenu: SubMenu;
    parentOrder: number;
    areaId: string;
    empresaId: string;
    empresaName: string;
}> = ({ submenu, parentOrder, areaId, empresaId, empresaName }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: submenu.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? "rgba(0,0,0,0.02)" : "transparent",
    };

    return (
        <TableRow ref={setNodeRef} style={style} {...attributes}>
            <TableCell className="cursor-move place-items-center" {...listeners}>
                <Icon iconName="mingcute:move-line" />
            </TableCell>
            <TableCell style={{ paddingLeft: "4rem" }}>
                <div className="flex items-center space-x-2">
                    <Icon iconName={submenu.icon || ""} className="h-4 w-4" />
                    <span className="font-medium capitalize">{submenu.title}</span>
                    <Badge variant="outline" className="text-xs">Submenu</Badge>
                </div>
            </TableCell>
            <TableCell>
                <code className="text-sm bg-muted-foreground/50 px-2 py-1 rounded font-mono">
                    {submenu.path}
                </code>
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-1">
                    {submenu.rolesAllowed?.slice(0, 2).map((role) => (
                        <Badge key={role} variant="default" className="text-xs capitalize">
                            {role.replace("_", " ")}
                        </Badge>
                    ))}
                    {submenu.rolesAllowed && submenu.rolesAllowed.length > 2 && (
                        <Badge>+{submenu.rolesAllowed.length - 2}</Badge>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="default" className="text-xs">
                    {parentOrder}.{submenu.order}
                </Badge>
            </TableCell>
            <TableCell className="flex items-center justify-center">
                <div className="flex space-x-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="default" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Editar submenu</DialogTitle>
                                <DialogDescription>
                                    Modifica el submenu de tu área.
                                </DialogDescription>
                            </DialogHeader>
                            <SubMenuForm menuId={submenu.menuId} menuTitle={submenu.title} />
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
    );
}

export default SortableSubmenuRow