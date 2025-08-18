"use client"

import { ReporteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes";
import { collection, doc, Timestamp, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";
import { db } from "@/firebase/client";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useState } from "react";
import { toast } from "sonner";
import ExcelJS from 'exceljs'

const headerMap: Record<string, keyof ReporteViajes> = {
    "Mes": "Mes",
    "Fecha": "Fecha",
    "FacturaPemex": "FacturaPemex",
    "Cliente": "Cliente",
    "DescripcionDelViaje": "DescripcionDelViaje",
    "Producto": "Producto",
    "Equipo": "Equipo",
    "Operador": "Operador",
    "M3": "M3",
    "LitrosA20": "LitrosA20",
    "LitrosDescargadosEstaciones": "LitrosDescargadosEstaciones",
    "Temp": "Temp",
    "Incremento": "Incremento",
    "FALTANTESYOSOBRANTESA20": "FALTANTESYOSOBRANTESA20",
    "FALTANTESYOSOBRANTESALNATURAL": "FALTANTESYOSOBRANTESALNATURAL",
    "Municipio": "Municipio",
    "Year": "Year",
    "Flete": "Flete",
};

type ExcelDataRow = { [key: string]: string | number | Date | Timestamp };

const UploadViajesExcel = () => {
    const router = useRouter();
    const [excelData, setExcelData] = useState<ReporteViajes[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploaded, setUploaded] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const validateReporteViajes = (reporte: ReporteViajes): boolean => {
        return (
            reporte.Mes !== "" &&
            reporte.Cliente !== "" &&
            reporte.DescripcionDelViaje !== "" &&
            reporte.Producto !== "" &&
            reporte.Equipo !== "" &&
            reporte.Operador !== ""
        );
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                const arrayBuffer = e.target.result;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(arrayBuffer);

                const sheet = workbook.worksheets[7];
                if (!sheet) {
                    toast.error("No se encontró la hoja esperada en el archivo");
                    return;
                }

                const sheetHeaders: string[] = [];
                const jsonData: ExcelDataRow[] = [];

                sheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        row.eachCell((cell) => sheetHeaders.push(cell.text));
                    } else {
                        const rowData: any = {};
                        row.eachCell((cell, colNumber) => {
                            rowData[sheetHeaders[colNumber - 1]] = cell.value;
                        });
                        jsonData.push(rowData);
                    }
                });

                setHeaders(sheetHeaders);

                const convertedData: ReporteViajes[] = jsonData.map((row: any) => {
                    const convertedRow: Partial<ReporteViajes> = {};

                    for (const key in row) {
                        const mappedKey = headerMap[key];
                        if (mappedKey) {
                            (convertedRow as any)[mappedKey] = row[key];
                        }
                    }

                    return {
                        ...convertedRow,
                        id: "",
                        createAt: new Date(),
                        updateAt: new Date(),
                    } as ReporteViajes;
                });

                console.log("convertedData", convertedData);
                setExcelData(convertedData);
                setTotal(convertedData.length);
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error("Error leyendo Excel:", err);
            toast.error("Hubo un problema leyendo el archivo Excel");
        }
    };

    const uploadReporteViajes = async (data: ReporteViajes[]) => {
        const batchSize = 1500;
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = writeBatch(db);
            const batchData = data.slice(i, i + batchSize);

            batchData.forEach((reporte) => {
                const docRef = doc(collection(db, "reporteViajes"));
                batch.set(docRef, { ...reporte, id: docRef.id, Fecha: reporte.Fecha });
            });

            await batch.commit();
            setUploaded((prev) => prev + batchData.length);
        }
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const filteredData = excelData.filter(validateReporteViajes);
            if (filteredData.length !== excelData.length) {
                toast.warning("Algunos datos no son válidos y se omitirán");
            }

            await uploadReporteViajes(filteredData);
            setLoading(false);
            router.refresh();
            toast.success("Datos subidos sin errores");
        } catch (error) {
            console.error('Error al subir los datos:', error);
            toast.error("Hubo un error al subir los datos");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <Card className="sm:max-w-lg w-full p-10 dark:bg-slate-900 rounded-xl z-10">
                <div className="mt-8 space-y-3">
                    <div className="grid grid-cols-1 space-y-2">
                        <label className="text-sm font-bold text-gray-500 tracking-wide">Adjunte un documento Excel</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                                <div className="h-full w-full text-center flex flex-col justify-center items-center">
                                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                                        <img
                                            className="has-mask h-36 object-center"
                                            src="https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg"
                                            alt="freepik image"
                                        />
                                    </div>
                                    <p className="pointer-none text-gray-500">
                                        <span>Puede arrastrar y soltar</span> archivos aqui
                                        <br />
                                        o <span className="text-red-700 hover:underline">seleccione un archivo</span> de su computadora
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    disabled={loading}
                                    className="hidden"
                                    accept=".xlsx, .xls, .xlsm"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300">
                        <span>Tipos de archivos aceptados: .xlsx, .xls, .xlsm</span>
                    </p>
                    <div>
                        {headers.length > 0 && (
                            <div>
                                <Button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                                >
                                    Subir todos los datos
                                </Button>
                                {loading && (
                                    <div className="mt-4">
                                        <Progress value={(uploaded / total) * 100} />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Subiendo {uploaded} de {total} registros...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default UploadViajesExcel