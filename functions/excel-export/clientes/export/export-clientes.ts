import { Clientes } from "@/modules/logistica/bdd/clientes/types/clientes";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportClientes = async (clientes: Clientes[], areaName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    worksheet.columns = [
        { header: "Id", key: "id", width: 40 },
        { header: "Nombre Fiscal", key: "nombreFiscal", width: 40 },
        { header: "Nombre Corto", key: "nombreCorto", width: 20 },
        { header: "RFC", key: "rfc", width: 30 },
        { header: "CURP", key: "curp", width: 30 },
        { header: "Tipo cliente", key: "tipoCliente", width: 30 },
        { header: "Grupo", key: "grupo", width: 30 },
        { header: "Correo", key: "correo", width: 30 },
        { header: "Activo", key: "activo", width: 30 },
        { header: "Calle", key: "calle", width: 30 },
        { header: "Colonia", key: "colonia", width: 30 },
        { header: "Localidad", key: "localidad", width: 30 },
        { header: "Municipio", key: "municipio", width: 30 },
        { header: "Estado", key: "estado", width: 30 },
        { header: "País", key: "pais", width: 30 },
        { header: "C.P.", key: "cp", width: 30 },
        { header: "Teléfono", key: "telefono", width: 30 },
        { header: "Celular", key: "celular", width: 30 },
        { header: "Exterior", key: "exterior", width: 30 },
        { header: "Interior", key: "interior", width: 30 },
        { header: "Contacto 1", key: "contactos", width: 30 },
        { header: "Contacto 2", key: "contactos", width: 30 },
        { header: "Contacto 3", key: "contactos", width: 30 },
    ]

    worksheet.addTable({
        name: "Cliente",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleMedium2",
            showRowStripes: true,
        },
        columns: worksheet.columns.map((col) => ({ name: col.header as string })),
        rows: clientes.map((cliente) => [
            cliente.id,
            cliente.nombreFiscal,
            cliente.nombreCorto,
            cliente.rfc,
            cliente.curp,
            cliente.tipoCliente,
            cliente.grupo,
            cliente.correo,
            cliente.activo,
            cliente.domicilio.calle,
            cliente.domicilio.colonia,
            cliente.domicilio.localidad,
            cliente.domicilio.municipio,
            cliente.domicilio.estado,
            cliente.domicilio.pais,
            cliente.domicilio.cp,
            cliente.domicilio.telefono,
            cliente.domicilio.celular,
            cliente.domicilio.exterior,
            cliente.domicilio.interior,
            cliente.contactos[0]?.nombre,
            cliente.contactos[1]?.nombre,
            cliente.contactos[2]?.nombre,
        ])
    })

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Clientes_${areaName}_${new Date().toLocaleDateString()}.xlsx`);
}