"use client"

import { Menu } from "@/modules/menus/types/menu-sistema";
import { useSortable } from "@dnd-kit/sortable";
import Icon from "@/components/global/icon";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
    id: string;
    menu: Menu;
}

const SorteableItem: React.FC<SortableItemProps> = ({ id, menu }) => {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="grid grid-cols-7 gap-4 p-2 items-center bg-white dark:bg-black"
        >
            {/* Área de arrastre */}
            <div
                className="cursor-move"
                {...attributes}
                {...listeners}
            >
                <Icon iconName="mingcute:move-line" />
            </div>

            {/* Resto del contenido */}
            <div>{menu.id}</div>
            <div>{menu.order}</div>
            <div className="capitalize">{menu.title}</div>
            <div>
                <Icon iconName={menu.icon || ""} />
            </div>
            <div>{menu.path}</div>
            <div className="flex justify-center gap-4">
                {/** <CreateSubMenuDialog menu={menu} /> */}
            </div>
        </div>
    )
}

export default SorteableItem