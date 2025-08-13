export function getMaintenanceUrgency(lastMaintenance: Date): "overdue" | "due" | "upcoming" | "good" {
    const daysSince = Math.floor((new Date().getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSince > 90) return "overdue"
    if (daysSince > 75) return "due"
    if (daysSince > 60) return "upcoming"
    return "good"
}