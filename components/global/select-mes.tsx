"use client"

import { meses } from "@/constants/meses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Mes = typeof meses[number];

interface SelectMesProps {
    value: Mes;
    onChange: (value: Mes) => void;
    className?: string;
}

const SelectMes: React.FC<SelectMesProps> = ({ value, onChange, className }) => {
    return (
        <div className={`relative h-10 ${className}`}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                    {meses.map((mes) => (
                        <SelectItem key={mes} value={mes} className="text-black dark:text-white">
                            {mes}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectMes;