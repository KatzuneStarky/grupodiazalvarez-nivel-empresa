import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion";
import { writeEstacion } from "@/modules/logistica/estaciones/actions/write";
import ExcelJS from "exceljs";

export const importEstaciones = async (file: File) => {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    const resultados: { fila: number; mensaje: string; success: boolean }[] = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);

        try {
            const nombre = String(row.getCell(2).value);
            const razonSocial = String(row.getCell(3).value);
            const rfc = String(row.getCell(4).value);
            const calle = String(row.getCell(5).value);
            const nExterior = String(row.getCell(6).value);
            const nInterior = String(row.getCell(7).value);
            const colonia = String(row.getCell(8).value);
            const ciudad = String(row.getCell(9).value)
            const estado = String(row.getCell(10).value)
            const cp = String(row.getCell(11).value)
            const pais = String(row.getCell(12).value)
            const lat = Number(row.getCell(13).value)
            const lng = Number(row.getCell(14).value)
            const telefono = String(row.getCell(15).value)
            const email = String(row.getCell(16).value)
            const responsable = String(row.getCell(17).value)
            const cargo = String(row.getCell(18).value)
            const permisoCre = String(row.getCell(19).value)
            const horarios = String(row.getCell(20).value)
            const productos = String(row.getCell(21).value).split(",").map((producto) => producto.trim());

            const dataEstacion: Omit<
                EstacionServicio,
                "id" | "createdAt" | "updatedAt"
            > = {
                activo: true,
                contacto: [{
                    cargo: cargo as "Gerente" | "Encargado",
                    email: email,
                    responsable: responsable,
                    telefono: telefono
                }],
                direccion: {
                    calle: calle,
                    ciudad: ciudad,
                    colonia: colonia,
                    codigoPostal: cp,
                    estado: estado,
                    numeroExterior: nExterior,
                    numeroInterior: nInterior,
                    pais: pais
                },
                fechaRegistro: new Date(),
                horarios: horarios,
                nombre: nombre,
                numeroPermisoCRE: permisoCre,
                ubicacion: {
                    lat: lat,
                    lng: lng
                },
                razonSocial: razonSocial,
                rfc: rfc,
                productos: productos as ("Diesel" | "Magna" | "Premium")[],
                tanques: []
            };

            const result = await writeEstacion(dataEstacion);

            resultados.push({
                fila: rowNumber,
                mensaje: result.message,
                success: result.success,
            });
        } catch (error) {
            resultados.push({
                fila: rowNumber,
                mensaje: error instanceof Error ? error.message : String(error),
                success: false,
            });
        }
    }

    return resultados
}