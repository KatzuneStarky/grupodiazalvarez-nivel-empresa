import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value?: string | null;
    colorClass: string;
    children?: React.ReactNode;
}

export const InfoCard = ({ icon: Icon, label, value, colorClass, children }: InfoCardProps) => (
    <div className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300">
        <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${colorClass.replace("text-", "bg-").replace("600", "100").replace("400", "900")}`}>
                <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {label}
            </span>
        </div>
        {value && <p className="text-lg font-bold text-slate-900 dark:text-slate-100 break-all">{value}</p>}
        {children}
    </div>
);
