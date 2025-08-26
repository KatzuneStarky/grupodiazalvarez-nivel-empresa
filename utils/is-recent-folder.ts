import { subDays } from "date-fns"

export function isWithinLast7Days(date: Date): boolean {
    const sevenDaysAgo = subDays(new Date(), 7)
    return date >= sevenDaysAgo
}