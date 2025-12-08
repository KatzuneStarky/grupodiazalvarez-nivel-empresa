import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { SystemUser } from "@/types/usuario";
import { Area } from "@/modules/areas/types/areas";
import { Menu } from "@/modules/menus/types/menu-sistema";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportArea = async (area: Area, menus: Menu[], users: SystemUser[]) => {
    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Información General
    const sheetArea = workbook.addWorksheet("Información General");
    sheetArea.columns = [
        { header: "Campo", key: "field", width: 30 },
        { header: "Valor", key: "value", width: 50 },
    ];

    sheetArea.addTable({
        name: "InfoArea",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleMedium2",
            showRowStripes: true,
        },
        columns: [{ name: "Campo" }, { name: "Valor" }],
        rows: [
            ["ID", area.id],
            ["Nombre", area.nombre],
            ["Descripción", area.descripcion || "N/A"],
            ["Correo Contacto", area.correoContacto || "N/A"],
            ["Responsable ID", area.responsableId || "N/A"],
            ["Empresa ID", area.empresaId],
            ["Fecha Creación", area.fechaCreacion ? parseFirebaseDate(area.fechaCreacion).toLocaleString() : "N/A"],
            ["Fecha Actualización", area.fechaActualizacion ? parseFirebaseDate(area.fechaActualizacion).toLocaleString() : "N/A"]
        ]
    });

    // Sheet 2: Menús
    if (menus && menus.length > 0) {
        const sheetMenus = workbook.addWorksheet("Menús");
        sheetMenus.columns = [
            { header: "Título", key: "title", width: 30 },
            { header: "Ruta", key: "path", width: 40 },
            { header: "Orden", key: "order", width: 10 },
            { header: "Roles Permitidos", key: "roles", width: 40 },
            { header: "Visible", key: "visible", width: 10 },
            { header: "Icono", key: "icon", width: 20 },
        ];

        sheetMenus.addTable({
            name: "Menus",
            ref: "A1",
            headerRow: true,
            style: {
                theme: "TableStyleMedium2",
                showRowStripes: true,
            },
            columns: sheetMenus.columns.map((col) => ({ name: col.header as string })),
            rows: menus.map(menu => [
                menu.title,
                menu.path,
                menu.order,
                menu.rolesAllowed ? menu.rolesAllowed.join(", ") : "Todos",
                menu.visible ? "Sí" : "No",
                menu.icon || "N/A"
            ])
        });
    }

    // Sheet 3: Usuarios
    if (users && users.length > 0) {
        const sheetUsers = workbook.addWorksheet("Usuarios");
        sheetUsers.columns = [
            { header: "ID Firebase", key: "uid", width: 40 },
            { header: "Nombre completo", key: "nombre", width: 40 },
            { header: "Email", key: "email", width: 30 },
            { header: "Rol de usuario", key: "rol", width: 15 },
            { header: "Estado", key: "estado", width: 15 },
            { header: "Teléfono", key: "telefono", width: 20 },
        ];

        sheetUsers.addTable({
            name: "Usuarios",
            ref: "A1",
            headerRow: true,
            style: {
                theme: "TableStyleMedium2",
                showRowStripes: true,
            },
            columns: sheetUsers.columns.map((col) => ({ name: col.header as string })),
            rows: users.map(user => [
                user.uid,
                user.nombre || "N/A",
                user.email,
                user.rol || "N/A",
                user.estado,
                user.contacto?.telefonoMovil || "N/A"
            ])
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Area_${area.nombre}_${new Date().toLocaleDateString()}.xlsx`);
};
