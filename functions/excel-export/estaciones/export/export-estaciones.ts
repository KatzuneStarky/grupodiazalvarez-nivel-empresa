import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportEstaciones = async (estaciones: EstacionServicio[], areaName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Estaciones");

    worksheet.columns = [
        { header: "Id", key: "id", width: 40 },
        { header: "Nombre", key: "nombre", width: 40 },
        { header: "Razón Social", key: "razonSocial", width: 40 },
        { header: "RFC", key: "rfc", width: 40 },
        { header: "Calle", key: "calle", width: 40 },
        { header: "Número Exterior", key: "numeroExterior", width: 40 },
        { header: "Número Interior", key: "numeroInterior", width: 40 },
        { header: "Colonia", key: "colonia", width: 40 },
        { header: "Ciudad", key: "ciudad", width: 40 },
        { header: "Estado", key: "estado", width: 40 },
        { header: "Código Postal", key: "codigoPostal", width: 40 },
        { header: "País", key: "pais", width: 40 },
        { header: "Latitud", key: "lat", width: 40 },
        { header: "Longitud", key: "lng", width: 40 },
        { header: "Teléfono", key: "telefono", width: 40 },
        { header: "Email", key: "email", width: 40 },
        { header: "Responsable", key: "responsable", width: 40 },
        { header: "Cargo", key: "cargo", width: 40 },
        { header: "Número de Permiso CRE", key: "numeroPermisoCRE", width: 40 },
        { header: "Horarios", key: "horarios", width: 40 },
        { header: "Productos", key: "productos", width: 40 },
        { header: "Tanques", key: "tanques", width: 40 },
        { header: "Activo", key: "activo", width: 40 },
        { header: "Fecha de Registro", key: "fechaRegistro", width: 40 },
    ];

    worksheet.addTable({
        name: "Estaciones",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleMedium2",
            showRowStripes: true,
        },
        columns: worksheet.columns.map((col) => ({ name: col.header as string })),
        rows: estaciones.map((estacion) => [
            estacion.id,
            estacion.nombre,
            estacion.razonSocial,
            estacion.rfc,
            estacion.direccion.calle,
            estacion.direccion.numeroExterior,
            estacion.direccion.numeroInterior,
            estacion.direccion.colonia,
            estacion.direccion.ciudad,
            estacion.direccion.estado,
            estacion.direccion.codigoPostal,
            estacion.direccion.pais,
            estacion.ubicacion?.lat,
            estacion.ubicacion?.lng,
            estacion.contacto[0]?.telefono,
            estacion.contacto[0]?.email,
            estacion.contacto[0]?.responsable,
            estacion.contacto[0]?.cargo,
            estacion.numeroPermisoCRE,
            estacion.horarios,
            estacion.productos?.join(", "),
            estacion.tanques.map((tanque) => tanque.tipoCombustible).join(", "),
            estacion.activo,
            estacion.fechaRegistro,
        ])
    })

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Estaciones_${areaName}_${new Date().toLocaleDateString()}.xlsx`);
}