"use client"

import MetricCard from "./components/metric-card"
import { Activity, DollarSign, Fuel, Gauge } from "lucide-react"

const MainDashboardLogistica = () => {
    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <MetricCard
                    title="Total Revenue"
                    value="$148.2K"
                    change="+14.7%"
                    changeType="positive"
                    icon={DollarSign}
                    progress={74}
                    target="$200K"
                    additional={[
                        { label: "Weekly", value: "$45.2K" },
                        { label: "Daily Avg", value: "$6.5K" },
                    ]}
                    className="xl:col-span-2"
                />

                <MetricCard
                    title="Fuel Transported"
                    value="14.8K m³"
                    change="+8.9%"
                    changeType="positive"
                    icon={Fuel}
                    progress={82}
                    target="18K m³"
                    additional={[
                        { label: "Weekly", value: "3.4K m³" },
                        { label: "Daily Avg", value: "485 m³" },
                    ]}
                />
                <MetricCard
                    title="Fleet Efficiency"
                    value="91.2%"
                    change="+2.1%"
                    changeType="positive"
                    icon={Gauge}
                    progress={91}
                    target="95%"
                    additional={[
                        { label: "On-Time", value: "94%" },
                        { label: "Fuel Eff", value: "88%" },
                    ]}
                />
                <MetricCard
                    title="Active Operations"
                    value="156"
                    change="+12.3%"
                    changeType="positive"
                    icon={Activity}
                    subtitle="Total trips this month"
                    additional={[
                        { label: "Completed", value: "148" },
                        { label: "In Transit", value: "8" },
                    ]}
                />
            </div>
        </div>
    )
}

export default MainDashboardLogistica