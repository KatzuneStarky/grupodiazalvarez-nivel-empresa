"use client"

import { useStorageUsagePerSubfolderEquipo } from "../../documentos/hooks/use-storage-per-subfolder-equipo";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatStorage, parseStorage } from "@/utils/file-storage";
import { Pie, PieChart, TooltipProps } from "recharts";
import Icon from "@/components/global/icon";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";

const EquipoIdChart = ({ equipoId }: { equipoId: string }) => {
    const { storageData } = useStorageUsagePerSubfolderEquipo("equipos", equipoId, 10000);

    const totalArchivos = storageData?.archivos ?? 0;
    const totalArchivosVencimiento = storageData?.archivosVencimiento ?? 0;
    const totalCertificado = storageData?.certificado ?? 0;
    const totalUsed = totalArchivos + totalArchivosVencimiento + totalCertificado;

    const chartData = [
        { name: "Archivos", value: totalArchivos, fill: "#4CAF50" },
        { name: "Archivos Vencimiento", value: totalArchivosVencimiento, fill: "#FF9800" },
        { name: "Certificado", value: totalCertificado, fill: "#2196F3" },
    ];

    const legendItems = [
        { label: "Archivos", icon: "lucide:files", color: "#4CAF50", value: formatStorage(totalArchivos) },
        { label: "Archivos vencimiento", icon: "tabler:file-x-filled", color: "#FF9800", value: formatStorage(totalArchivosVencimiento) },
        { label: "Certificado", icon: "tabler:certificate", color: "#2196F3", value: formatStorage(totalCertificado) },
    ];

    const chartConfig = {
        archivos: { label: "Archivos", color: "#4CAF50" },
        archivosVencimiento: { label: "Archivos Vencimiento", color: "#FF9800" },
        certificado: { label: "Certificado", color: "#2196F3" },
    } satisfies ChartConfig;

    const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            return (
                <div className="bg-white p-4 text-[14px] border shadow-lg">
                    <p className="font-extrabold">
                        {`${name}:`}{" "}
                        <span className="font-bold">
                            {formatStorage(value || 0)}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const { value: totalValue, unit: totalUnit } = parseStorage(totalUsed);

    return (
        <Card className="overflow-hidden p-6 w-full">
            <div className="flex items-start justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-800 dark:text-white w-32">
                    Uso de almacenamiento por tipo de archivo
                </h2>
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-white">
                        Almacenamiento total
                    </p>
                    <p className="text-lg font-bold text-gray-700 dark:text-white">
                        {formatStorage(totalUsed)}
                    </p>
                </div>
            </div>

            <div className="relative h-fit mx-auto">
                <ChartContainer
                    config={chartConfig}
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<CustomTooltip />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                        />
                    </PieChart>
                </ChartContainer>
                <div className="absolute -top-2 inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-700 dark:text-white">
                            <CountUp decimal="." start={0} end={totalValue} duration={2} /> {totalUnit}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white">Almacenamiento <br /> usado</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {legendItems.map((item, index) => (
                    <Card key={index} className="p-3 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                            <Icon
                                iconName={item.icon}
                                className="w-5 h-5"
                                style={{ color: item.color }}
                            />
                            <span className="text-gray-700 dark:text-white text-xs font-medium">{item.label}</span>
                        </div>
                        <span
                            className="text-sm font-semibold block"
                            style={{ color: item.color }}
                        >
                            {item.value}
                        </span>
                    </Card>
                ))}
            </div>
        </Card>
    )
}

export default EquipoIdChart