"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const mechanicData = [
    { name: "Juan G.", active: 4, completed: 12 },
    { name: "Carlos L.", active: 3, completed: 15 },
    { name: "Miguel T.", active: 2, completed: 10 },
    { name: "Pedro R.", active: 5, completed: 8 },
    { name: "Luis M.", active: 1, completed: 14 },
]

const MechanicWorkload = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mechanic Workload</CardTitle>
                <CardDescription>Active vs completed jobs this month</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mechanicData}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Bar dataKey="active" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-[hsl(var(--warning))]" />
                        <span className="text-muted-foreground">Active Jobs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-[hsl(var(--success))]" />
                        <span className="text-muted-foreground">Completed</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MechanicWorkload