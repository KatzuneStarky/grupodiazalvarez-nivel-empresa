export function getDaysUntilExpiry(date: Date): number {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  export function getExpiryStatus(date: Date): "expired" | "critical" | "warning" | "good" {
    const days = getDaysUntilExpiry(date)
    if (days < 0) return "expired"
    if (days <= 7) return "critical"
    if (days <= 30) return "warning"
    return "good"
  }
  
  export function getExpiryColor(status: "expired" | "critical" | "warning" | "good"): string {
    switch (status) {
      case "expired":
        return "text-red-600 bg-red-50 border-red-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
    }
  }