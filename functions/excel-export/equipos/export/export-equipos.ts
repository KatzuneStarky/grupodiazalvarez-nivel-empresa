import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportEquipos = async (equipos: Equipo[], areaName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipos");

    worksheet.columns = [
        { header: "Id", key: "id", width: 40 },
        { header: "Tipo unidad", key: "tipoUnidad", width: 15 },
        { header: "Numero economico", key: "numEconomico", width: 20 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Modelo", key: "modelo", width: 20 },
        { header: "Año", key: "year", width: 10 },
        { header: "Serie", key: "serie", width: 20 },
        { header: "Placas", key: "placas", width: 20 },
        { header: "M3", key: "m3", width: 10 },
        { header: "Tipo tanque", key: "tipoTanque", width: 20 },
        { header: "Estado actual", key: "estado", width: 20 },
        { header: "Activo", key: "activo", width: 20 },
        { header: "GPS Activo", key: "gpsActivo", width: 20 },
        { header: "Rendimiento promedio", key: "rendimientoPromedioKmPorLitro", width: 25 },
        { header: "Numero de tanques", key: "tanques", width: 20 },
        { header: "Grupo de la unidad", key: "grupoUnidad", width: 20 },
        { header: "Numero de mantenimientos", key: "mantenimiento", width: 25 },
        { header: "Tiene certificado", key: "Certificado", width: 20 },
        { header: "Cantidad de archivos", key: "archivos", width: 20 },
        { header: "Cantidad de archivos con vencimiento", key: "ArchivosVencimiento", width: 40 },
    ]

    worksheet.addTable({
        name: "equipos",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleMedium2",
            showRowStripes: true,
        },
        columns: worksheet.columns.map((col) => ({ name: col.header as string })),
        rows: equipos.map((equipo) => [
            equipo.id,
            equipo.tipoUnidad,
            equipo.numEconomico,
            equipo.marca,
            equipo.modelo,
            equipo.year,
            equipo.serie,
            equipo.placas,
            equipo.m3,
            equipo.tipoTanque,
            equipo.estado,
            equipo.activo === true ? "Equipo activo" : "Fuera de servicio",
            equipo.gpsActivo === true ? "GPS Activo" : "GPS Desactivado",
            equipo.rendimientoPromedioKmPorLitro,
            equipo.tanque.length,
            equipo.grupoUnidad,
            equipo.mantenimiento.length,
            equipo.Certificado.length > 0 ? "Si" : "No",
            equipo.archivos.length,
            equipo.ArchivosVencimiento.length
        ]),
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Parque-Vehicular_${areaName}_${new Date().toLocaleDateString()}.xlsx`);
}