import { TooltipProps } from "recharts";

export const CustomFaltantesTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
        const point = payload[0].payload;
        const isPositive = point.value > 0;
        const tipo = isPositive ? "Sobrante" : "Faltante";
        const formattedValue = point.value.toFixed(2);

        return (
            <div className="p-2 bg-white dark:bg-black border rounded-md">
                <div className="font-bold">{point.name}</div>
                <div className={`${isPositive ? "text-green-500" : "text-red-500"} font-semibold`}>
                    {tipo}: {formattedValue} M³
                </div>
            </div>
        );
    }
    return null;
};