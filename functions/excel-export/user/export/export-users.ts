import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { SystemUser } from "@/types/usuario";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportUsers = async (users: SystemUser[], areaName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Usuarios_Totales");

  worksheet.columns = [
    { header: "ID", key: "id", width: 40 },
    { header: "ID Firebase", key: "uidFirebase", width: 40 },
    { header: "Nombre completo", key: "nombre", width: 40 },
    { header: "Fecha Nacimiento", key: "fechaNacimiento", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Tipo Registro", key: "tipoRegistro", width: 15 },
    { header: "Estado de cuenta", key: "estado", width: 10 },
    { header: "Rol de usuario", key: "rol", width: 10 },
    { header: "Creado el", key: "creadoEn", width: 20 },
    { header: "Actualizado el", key: "actualizadoEn", width: 20 },
    { header: "Último Acceso", key: "ultimoAcceso", width: 20 },
  ];

  worksheet.getColumn("fechaNacimiento").numFmt = "dd/mm/yyyy";
  worksheet.getColumn("creadoEn").numFmt = "dd/mm/yyyy hh:mm";
  worksheet.getColumn("ultimoAcceso").numFmt = "dd/mm/yyyy hh:mm";

  worksheet.addTable({
    name: "Usuarios",
    ref: "A1",
    headerRow: true,
    style: {
      theme: "TableStyleMedium2",
      showRowStripes: true,
    },
    columns: worksheet.columns.map((col) => ({ name: col.header as string })),
    rows: users.map((user) => [
      user.id,
      user.uidFirebase,
      user.nombre ?? "N/A",
      user.fechaNacimiento
        ? new Date(parseFirebaseDate(user.fechaNacimiento)).toLocaleDateString()
        : "N/A",
      user.email,
      user.tipoRegistro,
      user.estado,
      user.rol ?? "N/A",
      user.creadoEn
        ? new Date(user.creadoEn).toLocaleString()
        : "N/A",
      user.actualizadoEn
        ? new Date(user.actualizadoEn).toLocaleString()
        : "N/A",
      user.ultimoAcceso
        ? new Date(user.ultimoAcceso).toLocaleString()
        : "N/A",
    ])
  })

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `usuarios_${areaName}_${new Date().toLocaleDateString()}.xlsx`);
};