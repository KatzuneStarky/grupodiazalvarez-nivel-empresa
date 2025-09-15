import { SystemUser } from "@/types/usuario";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";

export const exportUsers = async (users: SystemUser[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Usuarios_Totales");

  worksheet.columns = [
    { header: "ID", key: "id", width: 50 },
    { header: "ID Firebase", key: "uidFirebase", width: 50 },
    { header: "Nombre completo", key: "nombre", width: 30 },
    { header: "Fecha Nacimiento", key: "fechaNacimiento", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Tipo Registro", key: "tipoRegistro", width: 15 },
    { header: "Estado de cuenta", key: "estado", width: 30 },
    { header: "Rol de usuario", key: "rol", width: 30 },
    { header: "Creado el", key: "creadoEn", width: 20 },
    { header: "Actualizado el", key: "actualizadoEn", width: 20 },
    { header: "Último Acceso", key: "ultimoAcceso", width: 20 },
  ];

  users.forEach((user) => {
    worksheet.addRow({
      id: user.id,
      uidFirebase: user.uidFirebase,
      nombre: user.nombre ?? "N/A",
      fechaNacimiento: user.fechaNacimiento
        ? new Date(parseFirebaseDate(user.fechaNacimiento)).toLocaleDateString()
        : "N/A",
      email: user.email,
      tipoRegistro: user.tipoRegistro,
      estado: user.estado,
      rol: user.rol ?? "N/A",
      creadoEn: user.creadoEn
        ? new Date(user.creadoEn).toLocaleString()
        : "N/A",
      actualizadoEn: user.actualizadoEn
        ? new Date(user.actualizadoEn).toLocaleString()
        : "N/A",
      ultimoAcceso: user.ultimoAcceso
        ? new Date(user.ultimoAcceso).toLocaleString()
        : "N/A",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "usuarios.xlsx");
};