export const calculateTrend = (current: number, previous?: number) => {
    if (!previous || previous === 0) return undefined
    const percentage = ((current - previous) / previous) * 100
    return {
        percentage: Math.abs(percentage),
        isPositive: percentage >= 0,
    }
}