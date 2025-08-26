"use client"

import { formatStorage, MAX_STORAGE, parseStorage } from "@/utils/file-storage";
import { useStorageUsage } from "@/hooks/use-storage-usage";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Pie, PieChart, TooltipProps } from "recharts";
import Icon from "@/components/global/icon";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";

const DocumentsChart = () => {
    const { storageUsage } = useStorageUsage("equipos", 60000);

    const remainingStorage = MAX_STORAGE - (storageUsage || 0);

    const chartData = [
        { name: "Usado", value: storageUsage, fill: "#4CAF50" },
        { name: "Restante", value: remainingStorage, fill: "#E0E0E0" }
    ];

    const legendItems = [
        { label: "Usado", icon: "ic:sharp-data-usage", color: "#4CAF50", value: formatStorage(storageUsage || 0) },
        { label: "Restante", icon: "ic:outline-storage", color: "#aca3a3", value: formatStorage(remainingStorage) },
    ];

    const chartConfig = {
        used: {
            label: "Usado",
            color: "#4CAF50",
        },
        remaining: {
            label: "Restante",
            color: "#E0E0E0",
        },
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

    const { value: totalValue, unit: totalUnit } = parseStorage(storageUsage || 0)

    return (
        <Card className="overflow-hidden p-6 w-full">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-800 dark:text-white">
                    Uso total del almacenamiento
                </h2>
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-white">Almacenamiento total</p>
                    <p className="text-lg font-bold text-gray-700 dark:text-white">{formatStorage(MAX_STORAGE)}</p>
                </div>
            </div>

            <div className="relative h-fit mx-auto mb-4">
                <ChartContainer config={chartConfig}>
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
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-700 dark:text-white">
                            <CountUp decimal="." start={0} end={totalValue} duration={2} /> {totalUnit}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white">
                            Almacenamiento <br /> usado
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {legendItems.map((item, index) => (
                    <Card key={index} className=" p-3 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                            <Icon iconName={item.icon}
                                className="w-5 h-5"
                                style={{ color: item.color }}
                            />
                            <span className="text-gray-700 dark:text-white font-medium">{item.label}</span>
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

export default DocumentsChart