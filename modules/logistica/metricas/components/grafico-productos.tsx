"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { formatNumber } from "@/utils/format-number";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    LabelList,
    TooltipProps,
} from "recharts";

interface GraficoProductosProps {
    productos: Record<string, number>;
    titulo: string;
    descripcion: string;
    colorCliente: string;
    seleccionada?: boolean;
    colorMapping: Record<string, string>;
}

interface CustomTooltipProps extends TooltipProps<any, string> {
    colorMapping: Record<string, string>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, colorMapping }) => {
    if (active && payload && payload.length) {
        const { Producto, sumaM3 } = payload[0].payload;
        return (
            <div className="p-3 bg-white dark:bg-black border rounded-md shadow-lg">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: colorMapping[Producto] || "#000" }}
                        />
                        <span className="font-bold uppercase">{Producto}</span>
                    </div>
                    <div className="ml-6">
                        <span className="font-semibold">
                            Total M³: {formatNumber(sumaM3)} m³
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const chartConfig = {
    sumaM3: {
        label: "Suma M3",
        color: "hsl(var(--chart-1))",
    },
} satisfies Record<string, { label: string; color: string }>;

const GraficoProductos = ({
    productos,
    titulo,
    descripcion,
    colorCliente,
    seleccionada = false,
    colorMapping,
}: GraficoProductosProps) => {
    const data = Object.entries(productos).map(([Producto, sumaM3]) => ({
        Producto,
        sumaM3,
    }));

    return (
        <Card className={`border-4 ${colorCliente} w-full h-full transition-transform duration-200 ${seleccionada ? "ring-2 ring-green-500" : "hover:scale-[103%] hover:shadow-lg"}`}>
            <CardHeader>
                <CardTitle>{titulo}</CardTitle>
                <CardDescription>{descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} style={{ width: "100%", height: "100%" }}>
                    <BarChart data={data} layout="vertical" margin={{ top: 10, right: 50, bottom: 10, left: 50 }}>
                        <XAxis type="number" dataKey="sumaM3" />
                        <YAxis type="category" dataKey="Producto" tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip colorMapping={colorMapping} />} />
                        <Bar dataKey="sumaM3" radius={5}>
                            {data.map((d, index) => (
                                <Cell key={`cell-${index}`} fill={colorMapping[d.Producto] || "#000"} />
                            ))}
                            <LabelList
                                dataKey="sumaM3"
                                position="right"
                                className="fill-foreground font-bold"
                                formatter={formatNumber}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default GraficoProductos