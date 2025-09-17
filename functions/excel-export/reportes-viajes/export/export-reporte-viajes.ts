import { ReporteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportReporteViajes = async (reportes: ReporteViajes[], areaName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reportes_Viajes");

    worksheet.columns = [
        { header: "ID", key: "id", width: 40 },
        { header: "Mes", key: "Mes", width: 10 },
        { header: "Fecha", key: "Fecha", width: 20 },
        { header: "Cliente", key: "Cliente", width: 10 },
        { header: "Ruta", key: "DescripcionDelViaje", width: 30 },
        { header: "Producto", key: "Producto", width: 10 },
        { header: "Equipo", key: "Equipo", width: 10 },
        { header: "Operador", key: "Operador", width: 10 },
        { header: "M3", key: "M3", width: 10 },
        { header: "Litros a 20°", key: "LitrosA20", width: 10 },
        { header: "Listros descargados", key: "LitrosDescargadosEstaciones", width: 10 },
        { header: "Temperatura", key: "Temp", width: 10 },
        { header: "Incremento", key: "Incremento", width: 10 },
        { header: "Faltantes y/o sobrantes a 20°", key: "FALTANTESYOSOBRANTESA20", width: 10 },
        { header: "Faltantes y/o sobrantes al natural", key: "FALTANTESYOSOBRANTESALNATURAL", width: 10 },
        { header: "Municipio", key: "Municipio", width: 10 },
        { header: "Año", key: "Year", width: 10 },
        { header: "Flete", key: "Flete", width: 10 },
        { header: "FacturaPemex", key: "FacturaPemex", width: 10 },
        { header: "Creado el", key: "createdAt", width: 20 },
        { header: "Actualizado el", key: "updatedAt", width: 20 },
    ];

    worksheet.getColumn("Fecha").numFmt = "dd/mm/yyyy";
    worksheet.getColumn("createdAt").numFmt = "dd/mm/yyyy hh:mm";
    worksheet.getColumn("updatedAt").numFmt = "dd/mm/yyyy hh:mm";

    worksheet.addTable({
        name: "reportes_viajes",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleMedium2",
            showRowStripes: true,
        },
        columns: worksheet.columns.map((col) => ({ name: col.header as string })),
        rows: reportes.map((reporte) => [
            reporte.id,
            reporte.Mes,
            reporte.Fecha,
            reporte.Cliente,
            reporte.DescripcionDelViaje,
            reporte.Producto,
            reporte.Equipo,
            reporte.Operador,
            reporte.M3,
            reporte.LitrosA20,
            reporte.LitrosDescargadosEstaciones,
            reporte.Temp,
            reporte.Incremento,
            reporte.FALTANTESYOSOBRANTESA20 ?? "",
            reporte.FALTANTESYOSOBRANTESALNATURAL ?? "",
            reporte.Municipio,
            reporte.Year,
            reporte.Flete,
            reporte.FacturaPemex,
            reporte.createdAt,
            reporte.updatedAt,
        ]),
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `reporte_viajes_${areaName}_${new Date().toLocaleDateString()}.xlsx`);
}