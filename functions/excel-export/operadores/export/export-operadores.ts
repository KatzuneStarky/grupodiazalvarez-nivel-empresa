import { Operador } from "@/modules/logistica/bdd/operadores/types/operadores";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportOperadores = async (data: Operador[], areaName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Operadores");

    worksheet.columns = [
        { header: "Id", key: "id", width: 40 },
        { header: "apellidos", key: "apellidos", width: 30 },
        { header: "nombres", key: "nombres", width: 30 },
        { header: "telefono", key: "telefono", width: 30 },
        { header: "email", key: "email", width: 30 },
        { header: "nss", key: "nss", width: 30 },
        { header: "curp", key: "curp", width: 30 },
        { header: "ine", key: "ine", width: 30 },
        { header: "colonia", key: "colonia", width: 30 },
        { header: "calle", key: "calle", width: 30 },
        { header: "externo", key: "externo", width: 30 },
        { header: "cp", key: "cp", width: 30 },
        { header: "tipoSangre", key: "tipoSangre", width: 30 },
        { header: "numLicencia", key: "numLicencia", width: 30 },
        { header: "tipoLicencia", key: "tipoLicencia", width: 30 },
        { header: "emisor", key: "emisor", width: 30 },
        { header: "contactosEmergencia", key: "contactosEmergencia", width: 30 },
        { header: "idEquipo", key: "idEquipo", width: 30 },
        { header: "equipo", key: "equipo", width: 30 },
        { header: "Creado el", key: "createdAt", width: 30 },
        { header: "Actualiado el", key: "updatedAt", width: 30 },
    ];

    worksheet.addTable({
        name: "operadores",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleMedium2",
            showRowStripes: true,
        },
        columns: worksheet.columns.map((col) => ({ name: col.header as string })),
        rows: data.map((operador) => [
            operador.id,
            operador.apellidos,
            operador.nombres,
            operador.telefono,
            operador.email,
            operador.nss,
            operador.curp,
            operador.ine,
            operador.colonia,
            operador.calle,
            operador.externo,
            operador.cp,
            operador.tipoSangre,
            operador.numLicencia,
            operador.tipoLicencia,
            operador.emisor,
            operador.contactosEmergencia?.map((contacto) => `${contacto.nombre} - ${contacto.relacion} - ${contacto.telefono}`).join(", "),
            operador.idEquipo,
            operador.equipo?.numEconomico,
            operador.createdAt,
            operador.updatedAt,
        ]),
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Operadores-Pipas_${areaName}_${new Date().toLocaleDateString()}.xlsx`);
}